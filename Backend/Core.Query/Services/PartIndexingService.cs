using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using System.Globalization;
using System.Linq;
using Core.Querying.Extensions;
using Core.Querying.Find.Extensions.Content;
using Core.Querying.Infrastructure.Configuration;
using Platform.Models;
using Platform.Models.CMS.Pages;
using Platform.Models.CMS.Pages.Global;
using Platform.Models.Commerce.V2;
using Platform.Models.Commerce.V3;
using Platform.Models.Commerce.Validators;
using Platform.Models.Helpers;
using Platform.Models.Models.Market;
using Platform.Models.Services.Abstract;
using Platform.Models.Services.Implementation;
using Platform.Models.ViewModels.Search;
using EPiServer.Commerce.Catalog;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Commerce.Marketing;
using EPiServer.Core;
using EPiServer.Find.Cms;
using EPiServer.Find.Helpers;
using EPiServer.Logging;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Mediachase.Commerce;
using Mediachase.Commerce.Catalog;
using Mediachase.Commerce.Markets;
using Mediachase.Commerce.Pricing;
using ProductAvailability = Platform.Models.Commerce.V3.ProductAvailability;

namespace Core.Querying.Services
{
    public interface IPartIndexingService : ILoggingService
    {
        IndexContentResult IndexParts(List<PartProduct> partsCanBeDisplayed, CultureInfo language, MarketId[] marketIds, Func<string, bool> callbackNotification = null, int indexPageSize = 20);
        IndexContentResult IndexVirtualParts(List<PartProduct> partsCanBeDisplayed, CultureInfo language, MarketId[] marketIds, Func<string, bool> callbackNotification = null, int indexPageSize = 20);
        IndexContentResult IndexOrphanParts(List<PartProduct> partsCanBeDisplayed, CultureInfo language, BrandMarketMapping[] marketIdsMapping, Func<string, bool> callbackNotification = null, int indexPageSize = 20);
        IndexContentResult RemoveParts(List<PartProduct> partsToBeRemoved, Func<string, bool> callbackNotification = null);

        void BindSearchFields(PartProduct partProduct, CultureInfo language);
    }

    [ServiceConfiguration(typeof(IPartIndexingService))]
    public class PartIndexingService : ServicesBase, IPartIndexingService
    {
        private readonly UrlResolver _urlResolver;
        private readonly IPromotionEngine _promotionEngine;
        private readonly IMarketService _marketService;
        private readonly ReferenceConverter _referenceConverter;
        private readonly SiteSettingsHandler _siteSettingsHandler;
        private static CustomerGroupLoader _customerGroupLoader;
        protected readonly IPcCombinationPriceService _pcCombinationPriceService;
        private readonly ISiteDefinitionRepository _siteDefinition;
        private static readonly Dictionary<int, IList<CustomFilterType>> priceFilters = new Dictionary<int, IList<CustomFilterType>>();
        private static readonly Dictionary<string, IList<CustomFilterType>> marketPriceRanges = new Dictionary<string, IList<CustomFilterType>>();
        private int _maxItemsIndex = 20;
        private List<KeyValuePair<string, SiteSettingsPage>> _sites = null;
        private readonly PartMarketValidatorFactory _partMarketValidatorFactory;
        private Dictionary<string, IPartMarketValidator> _marketValidators = new Dictionary<string, IPartMarketValidator>();
        protected readonly IPricingService _pricingService;

        public PartIndexingService(
            UrlResolver urlResolver,
            IPromotionEngine promotionEngine,
            IMarketService marketService,
            ReferenceConverter referenceConverter,
            SiteSettingsHandler siteSettingHandler,
            CustomerGroupLoader customerGroupLoader,
            IPcCombinationPriceService pcCombinationPriceService,
            ISiteDefinitionRepository siteDefinition,
            PartMarketValidatorFactory partMarketValidatorFactory,
            IPricingService pricingService)
        {
            _urlResolver = urlResolver;
            _promotionEngine = promotionEngine;
            _marketService = marketService;
            _referenceConverter = referenceConverter;
            _siteSettingsHandler = siteSettingHandler;
            _customerGroupLoader = customerGroupLoader;

            _siteDefinition = siteDefinition;

            _pcCombinationPriceService = pcCombinationPriceService;
            _partMarketValidatorFactory = partMarketValidatorFactory;
            _pricingService = pricingService;

            #region Initialize Currency for markets
            var marketMapping = SiteSettings.Instance.GetBrandMarketMapping().Where(x => Constant.Markets.IsSparePartOrStaffAndBrandMarkets(x.MarketId) || Constant.Markets.IsB2BPartsMarket(x.MarketId) || Constant.Markets.IsVintecMarket(x.MarketId));
            var marketIds = marketMapping.Select(x => x.MarketId).Distinct().ToList();
            Currencies = new Dictionary<string, MarketData>();
            marketIds.ForEach(x =>
            {
                var market = _marketService.GetMarket(x);
                if (market == null)
                {
                    Logger.Error($"BindPartPrices:: WARNING The market {x} is not found in database!");
                }
                else
                {
                    Currencies.Add(x, new MarketData
                    {
                        Currency = market.DefaultCurrency,
                        Market = market
                    });
                }
            });
            #endregion

            foreach (var brandMarketMapping in marketMapping)
            {
                if (marketPriceRanges.ContainsKey(brandMarketMapping.MarketId))
                {
                    continue;
                }

                if (_contentLoader.TryGet(new ContentReference(brandMarketMapping.SiteSettingPageId),
                        out SiteSettingsPage settingPage) && settingPage != null)
                {
                    marketPriceRanges.Add(brandMarketMapping.MarketId, settingPage.PriceFilters ?? new List<CustomFilterType>());
                }
            }

            if (_sites == null || !_sites.Any())
            {
                _sites = _siteSettingsHandler.GetSiteMarketSettings().Where(x => marketIds.Any(y => y == x.Key)).ToList();
            }
        }

        private Dictionary<string, MarketData> Currencies { get; set; }
        public IndexContentResult IndexParts(List<PartProduct> partsCanBeDisplayed, CultureInfo language, MarketId[] marketIds, Func<string, bool> callbackNotification = null, int indexPageSize = 20)
        {
            InitializeValidators(marketIds);
            _maxItemsIndex = indexPageSize;
            var indexedCounter = 0;
            var result = new IndexContentResult
            {
                OutData = new List<IContent>(),
                Status = true
            };

            var rootPage = _siteDefinition.List().FirstOrDefault().RootPage;
            var systemSettingPage = _contentLoader.GetChildren<SystemSettingPage>(rootPage, language).FirstOrDefault();
            var configureBrands = systemSettingPage?.Brands;
            var itemsIndex = new List<PartProduct>();
            var itemsToBeRemoved = new List<PartProduct>();

            if (_sites == null || !_sites.Any())
            {
                _sites = _siteSettingsHandler.GetSiteMarketSettings(true).Where(x => marketIds.Any(y => y.Value == x.Key)).ToList();
            }

            var customerPriceFilterMarketIds = _sites.Where(x => x.Value.EnableCustomerPriceFilter).Select(y => new MarketId(y.Key));
            foreach (var partRead in partsCanBeDisplayed)
            {
                var part = partRead.CreateWritableClone<PartProduct>();

                if (part.IsStopped())
                {
                    itemsToBeRemoved.Add(part);
                    continue;
                }

                var itemKey = $"{part.PartNumber}-{part.ContentLink.ID}";

                try
                {
                    var assets = part.GetAssets<IContentImage>(_contentLoader, _urlResolver).ToList() ?? new List<string>();

                    if (part.ImagesList != null && part.ImagesList.Any())
                    {
                        assets.AddRange(part.ImagesList);

                    }

                    var variants = _contentLoader.GetItems(part.GetVariants(), language).Cast<VariationContent>().ToArray();

                    part.PartDetailedDescription = part.PartDetailedDescription ?? new XhtmlString("");
                    part.PartImages = assets.Where(x => !string.IsNullOrWhiteSpace(x));
                    part.Brands = MappingBrands(part.BrandsList, configureBrands).ToArray();

                    BindSearchFields(part, language);

                    part.PriceCombinations = GetPriceCombinations(part);

                    part.PartUrl = UrlHelpers.GetPartDetailsUrl(part);
                    part.SanitizedPartNumber = part.PartNumber.EliminateSpecialCharacters();
                    part.MixData = GetMixData(part);
                    part.IndexedDate = DateTime.Now.ToUniversalTime().ToString("dd-MM-yyyy hh:mm:ss");
                    part.MarketList = part.ModelPageList?.Select(x => x.MarketId).Distinct() ?? new List<string>();

                    BindPartPrices(marketIds, variants, part, _sites);

                    BindPartCustomerPrices(customerPriceFilterMarketIds, variants, part);

                    BindPartStockAvailability(marketIds, variants, part);


                    //Index list items
                    itemsIndex.Add(part);
                    InvokeNotification(callbackNotification, $"IndexParts:: Added part to index list: {itemKey}");

                    if (itemsIndex.Count >= _maxItemsIndex)
                    {
                        result.OutData = result.OutData.Concat(itemsIndex).ToList();
                        IndexTheList(itemsIndex, callbackNotification);
                    }

                    indexedCounter++;
                }
                catch (Exception e)
                {

                    var msg = $"ERROR: PartIndexingService::IndexParts error on {itemKey}: {e.Message}";
                    Logger.Error(msg, e);
                    InvokeNotification(callbackNotification, msg);
                }

            }

            if (itemsIndex.Any())
            {
                result.OutData = result.OutData.Concat(itemsIndex).ToList();
                IndexTheList(itemsIndex, callbackNotification, true);
            }

            if (itemsToBeRemoved.Any())
            {
                RemoveParts(itemsToBeRemoved, callbackNotification);
            }

            result.Message = $"Indexed parts: {result.OutData.Count}. Removed parts: {itemsToBeRemoved.Count}. Please check log for details.";

            Logger.Error($"INFO: {string.Join("\r\n", itemsToBeRemoved.Select(x => $"{x.PartNumber}-{x.ContentLink.ID}").ToList())}");

            return result;
        }

        public IndexContentResult IndexVirtualParts(List<PartProduct> partsCanBeDisplayed, CultureInfo language, MarketId[] marketIds, Func<string, bool> callbackNotification = null, int indexPageSize = 20)
        {
            InitializeValidators(marketIds);
            _maxItemsIndex = indexPageSize;
            var indexedCounter = 0;
            var notIndexedCounter = 0;
            var result = new IndexContentResult
            {
                OutData = new List<IContent>(),
                Status = true
            };

            var rootPage = _siteDefinition.List().FirstOrDefault().RootPage;
            var systemSettingPage = _contentLoader.GetChildren<SystemSettingPage>(rootPage, language).FirstOrDefault();
            var configureBrands = systemSettingPage?.Brands;
            var itemsIndex = new List<PartProduct>();
            var itemsToBeRemoved = new List<PartProduct>();

            if (_sites == null || !_sites.Any())
            {
                _sites = _siteSettingsHandler.GetSiteMarketSettings(true).Where(x => marketIds.Any(y => y.Value == x.Key)).ToList();
            }

            var customerPriceFilterMarketIds = _sites.Where(x => x.Value.EnableCustomerPriceFilter).Select(y => new MarketId(y.Key));
            foreach (var partRead in partsCanBeDisplayed)
            {
                var part = partRead.CreateWritableClone<PartProduct>();

                if (part.IsStopped())
                {
                    notIndexedCounter++;
                    itemsToBeRemoved.Add(part);
                    continue;
                }

                var itemKey = $"{part.PartNumber}-{part.ContentLink.ID}";

                try
                {
                    result.OutData.Add(part);
                    var assets = part.GetAssets<IContentImage>(_contentLoader, _urlResolver).ToList() ?? new List<string>();

                    if (part.ImagesList != null && part.ImagesList.Any())
                    {
                        assets.AddRange(part.ImagesList);

                    }

                    var variants = _contentLoader.GetItems(part.GetVariants(), language).Cast<VariationContent>().ToArray();

                    part.PartDetailedDescription = part.PartDetailedDescription ?? new XhtmlString("");
                    part.PartImages = assets.Where(x => !string.IsNullOrWhiteSpace(x));
                    part.Pncs = Enumerable.Empty<MarketContent>();
                    part.ModelNumbers = Enumerable.Empty<MarketContent>();
                    part.Brands = MappingBrands(part.BrandsList, configureBrands).ToArray();
                    part.PartCategoryCodes = Enumerable.Empty<MarketContent>();

                    //DONOT remove 3 next lines, it is used to generate URL for a part
                    var partCategories = part.DisplayableCategories();
                    part.PartCategoryNames = GetPartCategoryNamesByMarket(partCategories);
                    part.ModelCategoryNames = GetModelCategoryNamesByMarket(part);

                    part.PartUrl = UrlHelpers.GetPartDetailsUrl(part);
                    part.SanitizedPartNumber = part.PartNumber.EliminateSpecialCharacters();
                    //Clear PartCategoryNames and ModelCategoryNames to prevent the filter works on virtual parts
                    part.PartCategoryNames = Enumerable.Empty<MarketContent>();
                    part.ModelCategoryNames = Enumerable.Empty<MarketContent>();
                    part.MixData = GetMixData(part, true);
                    part.PriceCombinations = GetPriceCombinations(part);
                    part.IndexedDate = DateTime.Now.ToUniversalTime().ToString("dd-MM-yyyy hh:mm:ss");
                    part.MarketList = part.ModelPageList?.Select(x => x.MarketId).Distinct() ?? new List<string>();

                    BindPartPrices(marketIds, variants, part, _sites);
                    BindPartCustomerPrices(customerPriceFilterMarketIds, variants, part);
                    BindPartStockAvailability(marketIds, variants, part);

                    //Add to Index list items
                    itemsIndex.Add(part);
                    InvokeNotification(callbackNotification, $"IndexVirtualParts:: Added part to index list: {itemKey}");

                    if (itemsIndex.Count >= _maxItemsIndex)
                    {
                        result.OutData = result.OutData.Concat(itemsIndex).ToList();
                        IndexTheList(itemsIndex, callbackNotification);
                    }

                    indexedCounter++;
                }
                catch (Exception e)
                {
                    var msg = $"ERROR: PartIndexingService::IndexVirtualParts error on {itemKey}: {e.Message}";
                    Logger.Error(msg, e);
                    InvokeNotification(callbackNotification, msg);
                }

            }

            if (itemsIndex.Any())
            {
                result.OutData = result.OutData.Concat(itemsIndex).ToList();
                IndexTheList(itemsIndex, callbackNotification, true);
            }

            if (itemsToBeRemoved.Any())
            {
                RemoveParts(itemsToBeRemoved, callbackNotification);
            }

            result.Message = $"Indexed Virtual parts: {result.OutData.Count}. Removed parts: {itemsToBeRemoved.Count}. Please check log for details.";

            Logger.Error($"INFO: {string.Join("\r\n", itemsToBeRemoved.Select(x => $"{x.PartNumber}-{x.ContentLink.ID}").ToList())}");

            return result;
        }

        public IndexContentResult IndexOrphanParts(List<PartProduct> partsCanBeDisplayed, CultureInfo language, BrandMarketMapping[] marketIdsMapping, Func<string, bool> callbackNotification = null, int indexPageSize = 20)
        {
            _maxItemsIndex = indexPageSize;
            var result = new IndexContentResult
            {
                Status = false,
                OutData = new List<IContent>(),
                Message = "List part need to index is empty!"
            };
            var partToBeRemoved = new List<PartProduct>();
            var partToIndexed = new List<PartProduct>();
            foreach (var partRead in partsCanBeDisplayed)
            {
                var part = partRead.CreateWritableClone<PartProduct>();
                if (part.IsStopped())
                {
                    partToBeRemoved.Add(part);
                    continue;
                }

                partToIndexed.Add(part);

                var itemKey = $"{part.PartNumber}-{part.ContentLink.ID}";

                part.PartDetailedDescription = part.PartDetailedDescription ?? new XhtmlString("");
                part.PartImages = Enumerable.Empty<string>();
                part.Pncs = Enumerable.Empty<MarketContent>();
                part.ModelNumbers = Enumerable.Empty<MarketContent>();
                part.Brands = Enumerable.Empty<string>();
                part.PartCategoryCodes = Enumerable.Empty<MarketContent>();
                part.PartCategoryNames = Enumerable.Empty<MarketContent>();
                part.ModelCategoryNames = Enumerable.Empty<MarketContent>();
                part.SanitizedPartNumber = part.PartNumber.EliminateSpecialCharacters();
                part.PartUrl = "";
                part.MarketList = new List<string> { "All Brands" };
                part.PriceCombinations = Enumerable.Empty<PriceCombinations>(); //GetPriceCombinations(part);
                part.IndexedDate = DateTime.Now.ToUniversalTime().ToString("dd-MM-yyyy hh:mm:ss");
                part.MixData = GetMixData(part, true);

                InvokeNotification(callbackNotification, $"IndexOrphanParts:: Added part: {itemKey} to index list.");
                if (partToIndexed.Count >= _maxItemsIndex)
                {
                    result.OutData = result.OutData.Concat(partToIndexed).ToList();
                    IndexTheList(partToIndexed, callbackNotification);
                }

            }

            if (partToIndexed.Any())
            {
                result.OutData = result.OutData.Concat(partToIndexed).ToList();
                IndexTheList(partToIndexed, callbackNotification, true);
            }

            if (partToBeRemoved.Any())
            {
                RemoveParts(partToBeRemoved, callbackNotification);
            }

            result.Message = $"Indexed Orphan parts: {result.OutData.Count}. Removed parts: {partToBeRemoved.Count}. Please check log for details.";

            Logger.Error($"INFO: {string.Join("\r\n", partToBeRemoved.Select(x => $"{x.PartNumber}-{x.ContentLink.ID}").ToList())}");

            return result;
        }

        public IndexContentResult RemoveParts(List<PartProduct> partsToBeRemoved, Func<string, bool> callbackNotification = null)
        {
            var removeResult = new List<string>();

            foreach (var partProduct in partsToBeRemoved)
            {
                var status = ContentIndexer.Instance.TryDelete(partProduct, out var result);
                var msg =
                    $"Removing Part: {partProduct.PartNumber}--{partProduct.ContentLink.ID}. Status: {status}. Details result: {string.Join("|", result == null ? new string[] { } : result.Select(x => "id: " + x.Id + ".found " + x.Found + ".ok " + x.Ok + ".index " + x.Index))}";
                removeResult.Add(msg);
                Logger.Error($"RemoveParts:: INFO {msg}");
                InvokeNotification(callbackNotification, msg);
            }

            return new IndexContentResult
            {
                Status = true,
                Message = string.Join("\r\n", removeResult)
            };
        }

        public void BindSearchFields(PartProduct part, CultureInfo language)
        {
            var partCategories = part.DisplayableCategories();

            part.Pncs = GetPncNumbersByMarket(part);
            part.ModelNumbers = GetModelNumbersByMarket(part);
            part.PartCategoryCodes = GetPartCategoryCodesByMarket(partCategories);
            part.PartCategoryNames = GetPartCategoryNamesByMarket(partCategories);
            part.ModelCategoryNames = GetModelCategoryNamesByMarket(part);
            //part.AccessoryCategoryNames = GetPartCategoryNamesByMarket(partCategories.Where(x => x.IsAccessory)?.ToArray());
            //part.SubAccessoryCategoryNames = GetPartCategoryNamesByMarket(partCategories.Where(x => x.IsSubAccessory)?.ToArray());
            foreach (var partCategory in partCategories)
            {
                if (!string.IsNullOrWhiteSpace(partCategory.DefaultMarketIds))
                {
                    var markets = partCategory.DefaultMarketIds.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries);

                    MergeModelCategoryNamesByCompatibleModels(part, markets);
                }
            }
        }

        private void IndexTheList(List<PartProduct> itemsIndex, Func<string, bool> callbackNotification, bool isLastBatch = false)
        {
            if (isLastBatch && itemsIndex.Count > 0 || itemsIndex.Count >= _maxItemsIndex)
            {
                Index(itemsIndex);
                InvokeNotification(callbackNotification, $"IndexParts:: Indexed: {string.Join("\r\n", itemsIndex.Select(x => $"{x.Code}-{x.ContentLink.ID}")) }");
                itemsIndex.Clear();
            }
        }

        private IEnumerable<string> MappingBrands(IEnumerable<string> brands, IList<BrandDataItem> configBrands)
        {
            var result = new List<string>();

            if (brands == null || !brands.Any())
                return result;
            if (configBrands == null || !configBrands.Any())
                return brands;
            foreach (var item in brands.Distinct())
            {
                var itemConfig = configBrands.FirstOrDefault(x => !string.IsNullOrEmpty(x.BrandCode) && string.Equals(x.BrandCode, item, StringComparison.InvariantCultureIgnoreCase));
                if (itemConfig != null && !string.IsNullOrEmpty(itemConfig.BrandGroup))
                    result.Add(itemConfig.BrandGroup);
                else
                    result.Add(item);
            }
            return result.Distinct();
        }

        private IEnumerable<MarketContent> GetMixDataByMarket(PartProduct part, MarketId[] marketIds)
        {
            return marketIds.Select(x =>
            {
                if (!part.ModelNumbers.Any(p => p.MarketId.Equals(x.Value, StringComparison.InvariantCultureIgnoreCase)))
                {
                    return null;
                }
                return new MarketContent
                {
                    MarketId = x.Value,
                    Content = $"{string.Join(" ", part.ModelCategoryNames.Where(p => p.MarketId.Equals(x.Value)).Select(p => p.Content).ToList())} " +
                              $"{string.Join(" ", part.PartCategoryNames.Where(p => p.MarketId.Equals(x.Value)).Select(p => p.Content).ToList())} " +
                              $"{string.Join(" ", part.ModelNumbers.Where(p => p.MarketId.Equals(x.Value)).Select(p => p.Content).ToList())} " +
                              $"{string.Join(" ", part.Pncs.Where(p => p.MarketId.Equals(x.Value)).Select(p => p.Content).ToList())}"
                };
            }).Where(x => x != null).ToList();
        }

        private List<MarketContent> GetPartCategoryCodesByMarket(PartCategory[] partCategories)
        {
            List<MarketContent> marketContents = new List<MarketContent>();
            if (partCategories == null || partCategories.Length == 0)
            {
                return marketContents;
            }

            foreach (var partCategory in partCategories)
            {
                if (partCategory.ModelPartPageList != null && partCategory.ModelPartPageList.Any())
                {
                    marketContents.AddRange(partCategory.ModelPartPageList.Where(x => x.VisibleInMenu).Select(x => new MarketContent { MarketId = x.MarketId, Content = partCategory.Code }));
                }
                else if (partCategory.ModelPageListFromParts != null && partCategory.ModelPageListFromParts.Any())
                {
                    marketContents.AddRange(partCategory.ModelPageListFromParts.Where(x => x.VisibleInMenu).Select(x => new MarketContent { MarketId = x.MarketId, Content = partCategory.Code }));
                }
            }

            return marketContents;
        }

        private List<MarketContent> GetPncNumbersByMarket(PartProduct part)
        {

            return part.PncNumberListLinks != null ?
                part.PncNumberListLinks.Where(x => !string.IsNullOrWhiteSpace(x.Code) &&
                !x.IsVirtual).Select(x => new MarketContent { MarketId = x.MarketId, Content = x.Code }).Distinct().ToList() :
                new MarketContent[0].ToList();
        }

        private List<MarketContent> GetModelNumbersByMarket(PartProduct part)
        {

            return part.ModelNumberListLinks != null ?
                part.ModelNumberListLinks.Where(x => !string.IsNullOrWhiteSpace(x.Code) &&
                !x.IsVirtual).Select(x => new MarketContent { MarketId = x.MarketId, Content = x.Code }).Distinct().ToList() :
                new MarketContent[0].ToList();
        }

        private List<PriceCombinations> GetPriceCombinations(PartProduct part)
        {
            var retList = new List<PriceCombinations>();
            var pricelist = _pcCombinationPriceService.GetCombinationPriceByPartNumber(part.PartNumber);
            var rangePrices = GetRangePrice(part.Language);
            var b2bMarket = "AUSPB2B";

            foreach (var item in pricelist)
            {
                var range = rangePrices.FirstOrDefault(x => x.MinValue <= item.Price && x.MaxValue > item.Price);

                var row = new PriceCombinations
                {
                    AllowedCode = item.PriceListName,
                    MarketId = b2bMarket,
                    Price = item.Price,
                    BelongRangePrice = range?.Order.ToString(),
                    CurrencyCode = _marketService.GetMarket(b2bMarket).DefaultCurrency.CurrencyCode,
                    BulkPriceLevel = item.BulkPriceLevel?.Trim()
                };
                retList.Add(row);

            }
            return retList;
        }

        private IList<CustomFilterType> GetRangePrice(CultureInfo language)
        {
            if (priceFilters.ContainsKey(ContentReference.RootPage.ID))
            {
                return priceFilters[ContentReference.RootPage.ID];
            }
            var collection = new Collection<SiteSettingsPage>();
            PagedExtension.GetDescendantsOfType(ContentReference.RootPage, collection, language);
            foreach (var c in collection)
            {
                if (c.PriceFilters != null && c.PriceFilters.Any())
                {
                    priceFilters.Add(ContentReference.RootPage.ID, c.PriceFilters);
                    return c.PriceFilters;
                }
            }
            return new List<CustomFilterType>();
        }

        private List<MarketContent> GetModelCategoryNamesByMarket(PartProduct part)
        {

            return part.ModelPageList != null ?
                part.ModelPageList.Where(x => x.VisibleInMenu).Select(x => new MarketContent { MarketId = x.MarketId, Content = x.ModelCategoryName }).Distinct().ToList() :
                new MarketContent[0].ToList();
        }

        /// <summary>
        /// Merge with model category in Brand sites like Unilux
        /// </summary>
        /// <param name="part"></param>
        /// <param name="marketIds"></param>
        private void MergeModelCategoryNamesByCompatibleModels(PartProduct part, string[] marketIds)
        {
            if (part.ModelCategoryCodes == null)
            {
                part.ModelCategoryCodes = new List<MarketContent>();
            }
            if (part.ModelCategoryNames == null)
            {
                part.ModelCategoryNames = new List<MarketContent>();
            }


            //Clear the part category links
            foreach (var marketId in marketIds)
            {
                if (Constant.Markets.IsUnilux(marketId))
                {
                    part.ModelCategoryCodes = part.ModelCategoryCodes.Where(x =>
                    !x.MarketId.Equals(marketId, StringComparison.InvariantCultureIgnoreCase));

                    part.ModelCategoryNames = part.ModelCategoryNames.Where(x =>
                        !x.MarketId.Equals(marketId, StringComparison.InvariantCultureIgnoreCase));
                }
            }

            if (part.CompatibleModels == null || !part.CompatibleModels.Any())
            {
                return;
            }

            var models = part.CompatibleModels.Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToList();

            if (!models.Any())
            {
                return;
            }

            var modelContentRefs = new List<ContentReference>();

            models.ForEach(x =>
            {
                modelContentRefs.Add(_referenceConverter.GetContentLink(x.NormalizeCode(part.Language, ImportConstants.SubffixCode.Model),
                    CatalogContentType.CatalogEntry));
            });

            var modelProducts = _contentLoader.GetItems(modelContentRefs.Where(x => !ContentReference.IsNullOrEmpty(x)), part.Language)
                .OfType<ModelProduct>().ToList();

            foreach (var marketId in marketIds)
            {
                var siteSettingHandler = _sites.FirstOrDefault(m => m.Key == marketId);
                modelProducts.ForEach(x =>
                {
                    var categories = _contentLoader.GetItems(x.GetCategories(), part.Language).OfType<ModelCategory>().ToList();
                    if (siteSettingHandler.Value?.ApplianceTypeFilters != null && siteSettingHandler.Value.ApplianceTypeFilters.Any())
                    {
                        categories = categories.Where(mc => siteSettingHandler.Value.ApplianceTypeFilters.Contains(mc.DisplayName)).ToList();
                    }

                    if (categories.Any())
                    {
                        part.ModelCategoryCodes = part.ModelCategoryCodes.Concat(categories.Select(
                            p => new MarketContent
                            {
                                MarketId = marketId,
                                Content = p.Code
                            })).DistinctBy(p => p.CombinedContent());

                        part.ModelCategoryNames = part.ModelCategoryNames.Concat(categories.Select(
                            p => new MarketContent
                            {
                                MarketId = marketId,
                                Content = p.DisplayName
                            })).DistinctBy(p => p.CombinedContent());
                    }
                });
            }

        }

        private List<MarketContent> GetPartCategoryNamesByMarket(PartCategory[] partCategories)
        {
            List<MarketContent> marketContents = new List<MarketContent>();
            if (partCategories == null || partCategories.Length == 0)
            {
                return marketContents;
            }

            foreach (var partCategory in partCategories)
            {
                if (partCategory.ModelPartPageList != null && partCategory.ModelPartPageList.Any())
                {
                    marketContents.AddRange(partCategory.ModelPartPageList.Where(x => x.VisibleInMenu).Select(x => new MarketContent { MarketId = x.MarketId, Content = partCategory.DisplayName }));
                }
                else if (partCategory.ModelPageListFromParts != null && partCategory.ModelPageListFromParts.Any())
                {
                    marketContents.AddRange(partCategory.ModelPageListFromParts.Where(x => x.VisibleInMenu).Select(x => new MarketContent { MarketId = x.MarketId, Content = partCategory.DisplayName }));
                }
                if (!string.IsNullOrWhiteSpace(partCategory.DefaultMarketIds))
                {
                    var markets = partCategory.DefaultMarketIds.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                    marketContents.AddRange(markets.Select(x => new MarketContent { MarketId = x, Content = partCategory.DisplayName }));
                }
            }

            return marketContents.DistinctBy(x => x.CombinedContent()).ToList();
        }

        private static void BindPartStockAvailability(MarketId[] marketIds, VariationContent[] variants, PartProduct part)
        {
            var stockAvailable = new List<ProductAvailability>();

            foreach (var v in variants)
            {
                var stocks = v.GetStockPlacement();
                if (!stocks.Any())
                {
                    continue;
                }
                foreach (var marketId in marketIds)
                {
                    var warehouse = (stocks.FirstOrDefault(x => x.WarehouseCode.Equals(marketId.Value)) ?? stocks.FirstOrDefault(x => x.WarehouseCode.Equals("default"))) ?? stocks.FirstOrDefault();

                    stockAvailable.Add(new ProductAvailability
                    {
                        MarketId = marketId.Value,
                        WarehouseCode = warehouse.WarehouseCode,
                        IsAvailable = (warehouse.InStockQuantity > 0).ToString(),
                        InStockQuantity = warehouse.InStockQuantity
                    });
                }
            }

            part.ProductAvailabilities = stockAvailable;
        }
        private void BindPartCustomerPrices(IEnumerable<MarketId> marketIds, VariationContent[] variants, PartProduct part)
        {
            var markets = marketIds.ToList();

            if (variants.Any() && markets.Any())
            {
                part.VariationCode = variants.First().Code;
                List<PriceRange> prices = new List<PriceRange>();
                var rangePrices = GetRangePrice(part.Language);
                var customerGroups = _customerGroupLoader.Get()?.Select(x => x.Name)?.ToList();

                if (customerGroups == null || !customerGroups.Any())
                {
                    return;
                }
                customerGroups.Add(nameof(CustomerPricing.AllCustomers));
                foreach (var marketId in markets)
                {
                    if (!Currencies.ContainsKey(marketId.Value))
                    {
                        //Skip any market which doesn't have currency. This might cause of the market is not configured in CMM yet.
                        continue;
                    }

                    var retailPrices = VariationExtensions.GetCustomerPrices(marketId, variants.Select(x => new CatalogKey(x.Code)), customerGroups).ToList();
                    var currency = Currencies[marketId.Value];
                    if (retailPrices.Any())
                    {
                        foreach (var price in retailPrices)
                        {
                            var rewards = _promotionEngine.Evaluate(variants.First(x => x.Code.Equals(price.CatalogKey.CatalogEntryCode)).ContentLink, currency.Market, currency.Currency);
                            var discountedAmount = rewards.Where(x => x.Promotion.IsActive).Select(x => x.SavedAmount).Sum();
                            var discountedPrice = price.UnitPrice.Amount - discountedAmount;
                            var range = rangePrices.FirstOrDefault(r => r.MinValue < discountedPrice && r.MaxValue >= discountedPrice);
                            prices.Add(new PriceRange
                            {
                                MarketId = price.MarketId.Value,
                                CustomerGroup = string.IsNullOrWhiteSpace(price.CustomerPricing.PriceCode) ? price.CustomerPricing.PriceTypeId.ToString() : price.CustomerPricing.PriceCode,
                                CurrencyCode = price.UnitPrice.Currency.CurrencyCode,
                                Price = price.UnitPrice.Amount,
                                BelongRangePrice = range?.Order.ToString(),
                                DiscountPrice = discountedPrice,
                                PromotionLabel = discountedPrice == price.UnitPrice.Amount ? "" : $"{Math.Round(discountedAmount / price.UnitPrice.Amount * 100, 0)}% OFF"
                            });
                        }
                    }
                }

                part.CustomerPrices = prices;
            }
        }
        private void BindPartPrices(MarketId[] marketIds, VariationContent[] variants, PartProduct part, List<KeyValuePair<string, SiteSettingsPage>> _sites)
        {
            if (variants.Any())
            {
                var variation = variants.First();
                part.VariationCode = variation.Code;
                List<PriceRange> prices = new List<PriceRange>();
                List<AutoDeliveryPlan> deliveryPlans = new List<AutoDeliveryPlan>();
                var marketList = new List<string>();

                foreach (var marketId in marketIds)
                {
                    var currency = Currencies[marketId.Value];
                    if (currency == null)
                    {
                        Logger.Error($"Currency of part {part.PartNumber}-{part.ContentLink.ID} not found on market {marketId.Value}!");
                        continue;
                    }

                    var siteSetting = _sites.FirstOrDefault(x => x.Key.Equals(marketId.Value)).Value;

                    var validator = _marketValidators[marketId.Value];
                    if (!validator.CanDisplay(part))
                    {
                        continue;
                    }

                    var rangePrices = marketPriceRanges.ContainsKey(marketId.Value)
                        ? marketPriceRanges[marketId.Value]
                        : new List<CustomFilterType>();

                    var retailPrices = VariationExtensions.GetRetailPrices(marketId, new[] { new CatalogKey(variation.Code) }).ToList();
                    if (retailPrices.Any())
                    {
                        marketList.Add(marketId.Value);
                        foreach (var price in retailPrices)
                        {
                            var reward = _pricingService.GetDiscountedPrice(new[] { variation }, currency.Market, currency.Currency, null, price.UnitPrice.Amount).FirstOrDefault();
                            var discountedAmount = price.UnitPrice.Amount;
                            var savedAmount = 0m;
                            if (reward != null)
                            {
                                discountedAmount = reward.DiscountedAmount;
                                savedAmount = reward.SavedAmount;
                            }

                            var range = rangePrices.FirstOrDefault(r => r.MinValue < discountedAmount && r.MaxValue >= discountedAmount);

                            prices.Add(new PriceRange
                            {
                                MarketId = price.MarketId.Value,
                                CurrencyCode = price.UnitPrice.Currency.CurrencyCode,
                                Price = price.UnitPrice.Amount,
                                BelongRangePrice = range?.Order.ToString(),
                                DiscountPrice = discountedAmount,
                                PromotionLabel = discountedAmount == price.UnitPrice.Amount ? "" : $"{Math.Round(savedAmount / price.UnitPrice.Amount * 100, 0)}% OFF"
                            });
                        }
                    }

                    //Bind Auto Deliver plans
                    if (siteSetting.EnableRecurringFeature && !part.DisableAutoDelivery)
                    {
                        foreach (var plan in siteSetting.RecurringOptionList.Where(x => x.EnableOption && !string.IsNullOrWhiteSpace(x.PromotionCodes)).ToList())
                        {
                            var variationRewards = _pricingService.GetDiscountedPrice(new[] { variation }, currency.Market, currency.Currency, plan.PromotionCodes.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries)).FirstOrDefault();
                            if (variationRewards == null)
                            {
                                continue;
                            }

                            var appliedPromotionCodeOfPlanRewards = variationRewards.RewardDetails.Where(x => !string.IsNullOrWhiteSpace(x.AppliedCoupon) &&
                            !string.IsNullOrWhiteSpace(plan.PromotionCodes) && plan.PromotionCodes.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries).Contains(x.AppliedCoupon)).ToList();

                            if (appliedPromotionCodeOfPlanRewards.Any())
                            {
                                var planSavedAmount = appliedPromotionCodeOfPlanRewards.Sum(x => x.SavedAmount);

                                deliveryPlans.Add(new AutoDeliveryPlan
                                {
                                    MarketId = marketId.Value,
                                    CurrencyCode = currency.Currency,
                                    DiscountedAmount = variationRewards.DiscountedAmount,
                                    SavedAmount = planSavedAmount, //variationRewards.SavedAmount,
                                    Key = plan.OptionValue,
                                    Name = plan.OptionDisplayText,
                                    PercentageOff = Math.Round(planSavedAmount / variationRewards.LineItem.PlacedPrice * 100, 0).ToString(),
                                    AppliedCouponCodes = appliedPromotionCodeOfPlanRewards.Select(x => x.AppliedCoupon)
                                });
                            }

                        }
                    }
                }

                part.Prices = prices;
                part.AutoDeliveryPlans = deliveryPlans;
            }
        }

        private string GetMixData(PartProduct part, bool isVirtualPart = false)
        {
            var alias = string.IsNullOrWhiteSpace(part.Alias) ? "" : part.Alias;
            alias = alias.Replace(" ", "");

            if (isVirtualPart)
            {
                return $"{string.Join(" ", alias.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries))}";
            }

            return
                $"{string.Join(" ", part.ModelCategoryNames.Select(x => x.Content).Distinct().ToList())} " +
                $"{string.Join(" ", part.PartCategoryNames.Select(x => x.Content).Distinct().ToList())} " +
                $"{string.Join(" ", part.ModelNumbers.Select(x => x.Content).Distinct().ToList())} " +
                $"{string.Join(" ", part.Pncs.Select(x => x.Content).Distinct().ToList())} " +
                $"{string.Join(" ", alias.Split(new[] { ',', ';' }, StringSplitOptions.RemoveEmptyEntries))}";
        }

        private void InitializeValidators(MarketId[] marketIds)
        {
            foreach (var item in marketIds)
            {
                if (!_marketValidators.ContainsKey(item.Value))
                {
                    _marketValidators.Add(item.Value, _partMarketValidatorFactory.GetValidator(item));
                }
            }
        }
        private class MarketData
        {
            public Currency Currency { get; set; }
            public IMarket Market { get; set; }
        }
    }
}
