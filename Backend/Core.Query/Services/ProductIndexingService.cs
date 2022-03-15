using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Core.Querying.Extensions;
using Platform.Models.Business.AdminTools;
using Platform.Models.CMS.Blocks;
using Platform.Models.CMS.Pages;
using Platform.Models.CMS.Pages.Global;
using Platform.Models.CMS.Pages.Global.Settings.Abstracts;
using Platform.Models.CMS.Pages.SparePart;
using Platform.Models.Commerce.V2;
using Platform.Models.Commerce.V3;
using Platform.Models.Helpers;
using Platform.Models.Services.Abstract;
using Platform.Models.ViewModels.Commerce;
using Platform.Models.ViewModels.Commerce.Product;
using Platform.Models.ViewModels.Partials.Carousel;
using Platform.Models.ViewModels.Products;
using EPiServer;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Commerce.Catalog.Linking;
using EPiServer.Core;
using EPiServer.DataAbstraction;
using EPiServer.DataAccess;
using EPiServer.Filters;
using EPiServer.Find.ClientConventions;
using EPiServer.Find.Framework;
using EPiServer.Globalization;
using EPiServer.Logging;
using EPiServer.Security;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using EPiServer.Web.Routing;
using Newtonsoft.Json;
using Attribute = Platform.Models.Commerce.V2.Attribute;

namespace Core.Querying.Services
{
    public interface IProductIndexingService
    {
        void ReIndexProductCategoryFilter(PlatformCategory item, bool forceIndexSpecBenefit = false);
        void GenerateCategoryPageFilter(ProductCategoryPage item);
        void UpdateProductInfo(PlatformProduct item);
        void GenerateStandardPageTextSearch(StandardPage item);
        void ReIndexProduct(PlatformCategory item);
        List<PlatformProduct> GetProducts(ContentReference categoryReference, ProductCategoryPage item);
    }

    public class ProductCacheModel
    {
        public List<PlatformProduct> Products { get; set; }
        public List<FilterTypeModel> ProductTypes { get; set; }
    }

    public static class StringHelper
    {
        //private static readonly IAppSetting appSetting = ServiceLocator.Current.GetInstance<IAppSetting>();
        public static string RemoveSpecialCharacter(this string input)
        {
            //var specialChars = new[] { "/", "-", " ", @"\", "'", "\"" };
            var specialChars = new[] { "/", "-", " ", @"\", "'", "\"", "(", ")" };
            if (!string.IsNullOrEmpty(input))
            {
                var newStr = input;
                foreach (var c in specialChars)
                {
                    newStr = newStr.Replace(c, "");
                }
                return newStr;
            }

            return string.Empty;
        }
    }

    [ServiceConfiguration(typeof(IProductIndexingService))]
    public class ProductIndexingService : IProductIndexingService
    {
        protected static ILogger _log = LogManager.GetLogger(typeof(ProductIndexingService));
        private IRelationRepository _relationRepository = null;
        private IContentLoader _contentLoader = null;
        private IContentRepository _contentRepository;
        private IEluxCache _eluxCache;
        private CatalogContentService _catalogContentService;
        private IPricingService _pricingService;
        private UrlResolver _urlResolver;

        //private ContentReference _startPage;

        public ProductIndexingService(IRelationRepository relationRepository, IContentLoader contentLoader, IContentRepository contentRepository,
            IEluxCache eluxCache, CatalogContentService catalogContentService, IPricingService pricingService, UrlResolver urlResolver)
        {
            _eluxCache = eluxCache;
            _relationRepository = relationRepository;
            _contentLoader = contentLoader;
            _contentRepository = contentRepository;
            _catalogContentService = catalogContentService;
            _pricingService = pricingService;
            _urlResolver = urlResolver;
        }

        public void GenerateCategoryPageFilter(ProductCategoryPage item)
        {
            var productFilters = GetCategoryPageFilter(item);
            item.ProductFilters = JsonConvert.SerializeObject(productFilters);
        }

        public void UpdateProductInfo(PlatformProduct item)
        {
            if (item.MasterLanguage == null)
            {
                _log.Error($"ProductIndexingService::UpdateProductInfo Product {item.Code} - {item.Name} does not have MasterLanguage");
            }

            var categoryPage = GetCategoryPage(item);
            if (categoryPage != null && categoryPage.HideOnBrowseProduct)
            {
                item.TempData = new ProductTempData
                {
                    Price = 0
                };
            }
            else
            {
                GenerateProductTempData(item, categoryPage);
            }
        }

        public void GenerateStandardPageTextSearch(StandardPage item)
        {
            var space = "";
            item.TextSearch = item.NavTitle + space + Environment.NewLine;
            item.TextSearch += item.Name + space + Environment.NewLine;
            item.TextSearch += item.NavDescription + space + Environment.NewLine;
            if (!string.IsNullOrEmpty(item.Keywords))
                item.TextSearch += item.Keywords + space + Environment.NewLine;
        }

        public void ReIndexProductCategoryFilter(PlatformCategory item, bool forceIndexSpecBenefit = false)
        {
            var category = GetCategoryPage(item);
            _log.Information($"Starting ReIndexProductCategoryFilter with category: {item.Code} and force: {forceIndexSpecBenefit}");
            if (category != null)
            {
                _log.Information($"Found category page : {category.Name}. Start indexing...");
                var writeableItem = item.CreateWritableClone<PlatformCategory>();
                var needSave = false;
                if (forceIndexSpecBenefit || writeableItem.Techspecs == null || writeableItem.Techspecs.Count == 0)
                {
                    _log.Information($"ReIndexProductCategoryFilter Indexing Techspecs...");
                    UpdateTechspecsForCategory(writeableItem, category);
                    needSave = true;
                }

                if (forceIndexSpecBenefit || writeableItem.Benefits == null || writeableItem.Benefits.Count == 0)
                {
                    _log.Information($"ReIndexProductCategoryFilter Indexing Benefits...");
                    UpdateBenefitsForCategory(writeableItem, category);
                    needSave = true;
                }

                if (needSave)
                {
                    _log.Information($"ReIndexProductCategoryFilter need to save category after extract techspecs and benefits from products...");
                    _contentRepository.Save(writeableItem, SaveAction.ForceCurrentVersion, AccessLevel.NoAccess);
                }

                var productFilters = GetCategoryPageFilter(category);
                category.ProductFilters = JsonConvert.SerializeObject(productFilters);

                ContentDataQueryHandler.Instance.Create().Index(category);
            }
            else
            {
                _log.Error($"The category page for: {item.Name}|{item.Code} Not found. Indexing step is stopped!");
            }
        }

        public void ReIndexProduct(PlatformCategory item)
        {
            var category = GetCategoryPage(item);
            var client = ContentDataQueryHandler.Instance.Create();

            ContentDataQueryHandler.Instance.Create().Conventions.ForInstancesOf<PlatformProduct>().ExcludeFieldMatching(x =>
                x.HasMemberAttribute.Equals(nameof(PlatformProduct.SeoInformation)));

            var products = new List<PlatformProduct>();
            var contentLinks = _contentLoader.GetDescendents(item.ContentLink);

            _log.Information($"Starting ReIndexProduct with category: {item.Code} has {contentLinks.Count()} content links");

            foreach (var contentReference in contentLinks)
            {
                var p = _contentLoader.Get<CatalogContentBase>(contentReference);
                if (p is PlatformProduct)
                {
                    products.Add(p as PlatformProduct);
                }
            }

            if (products.Count == 0)
            {
                _log.Warning($"ReIndexProduct:: Cannot found any product in: {category.Name}");
            }
            else
            {
                _log.Information($"ReIndexProduct:: there are {products.Count} products found to Indexing: {DateTime.Now.ToString("hh:mm:ss")}");

                foreach (var product in products)
                {
                    try
                    {
                        _log.Information($"ReIndexProduct:: START Indexing on product: {product.Code}");

                        UpdateProductInfo(product);
                        if (product.TempData != null && product.TempData.Price <= 0)
                        {
                            continue;
                        }
                        client.Index(product);
                    }
                    catch (Exception ex)
                    {
                        _log.Error($"ReIndexProduct:: FAIL Indexing on product: {product.Code}", ex);
                        if (ex is NullReferenceException)
                        {
                            try
                            {
                                var writeableProduct = item.CreateWritableClone<PlatformProduct>();
                                writeableProduct.MetaDescription = string.IsNullOrWhiteSpace(writeableProduct.MetaDescription) ? writeableProduct.DisplayName : writeableProduct
                                    .MetaDescription;
                                _contentRepository.Save(writeableProduct, SaveAction.Publish, AccessLevel.NoAccess);
                                _log.Information($"EPiServerFindInitialization::UpdateProductInfo:: Tried to publish product again: {item.Code} - {item.Name}");

                                client.Index(item);

                            }
                            catch (Exception exception)
                            {
                                _log.Error($"EPiServerFindInitialization::UpdateProductInfo:: Try to publish and index again error: ", exception);
                            }
                        }
                    }
                }

                _log.Information($"ReIndexProduct::Finish Indexing product at: {DateTime.Now.ToString("hh:mm:ss")}");
            }
        }

        private List<string> GetNodes(ProductContent currentContent, ContentReference rf)
        {
            List<string> nodeList = new List<string>();

            foreach (var nodeRelation in currentContent.GetCategories())
            {
                var currentNode = _contentLoader.Get<NodeContent>(nodeRelation);
                if (currentNode != null)
                {
                    AddParentNodes(currentNode, nodeList, rf);
                }
            }

            return nodeList;
        }

        private void AddParentNodes(NodeContent currentNode, List<string> nodeList, ContentReference rf)
        {
            if (currentNode == null)
            {
                return;
            }

            if (!nodeList.Contains(currentNode.DisplayName))
            {
                nodeList.Add(currentNode.DisplayName);
            }
            var nodeRelations = currentNode.GetCategories().ToList();

            nodeRelations.Add(currentNode.ParentLink);
            if (currentNode.ContentLink.Equals(rf))
                return;

            foreach (var nodeRef in nodeRelations)
            {
                var node = _contentLoader.Get<CatalogContentBase>(nodeRef);
                AddParentNodes(node as NodeContent, nodeList, rf);
            }
        }
        //--------------------------------------------------------------------

        private PageDataCollection GetPageData(PageReference root, Type pageType, string language)
        {
            var searchPages = ServiceLocator.Current.GetInstance<IPageCriteriaQueryService>();
            var contentTypeRepository = ServiceLocator.Current.GetInstance<IContentTypeRepository>();

            var contentType = contentTypeRepository.Load(pageType);
            if (contentType == null)
            {
                return new PageDataCollection();
            }

            var productPageTypeCriterion = new PropertyCriteria
            {
                Name = "PageTypeID",
                Type = PropertyDataType.PageType,
                Value = contentType.ID.ToString(),
                Condition = CompareCondition.Equal,
                Required = true
            };

            var criteria = new PropertyCriteriaCollection
            {
                productPageTypeCriterion
            };

            var pageDataCollection = searchPages.FindPagesWithCriteria(root, criteria, language);

            return pageDataCollection;
        }

        private IEnumerable<ProductCategoryPage> GetProductCategories(string language)
        {
            var cacheKey = $"GetProductCategories_language.{language}";
            var productCategories = _eluxCache.Get<IEnumerable<ProductCategoryPage>>(cacheKey);
            if (productCategories != null && productCategories.Count() > 0)
                return productCategories;

            var siteDefinitionRepository = ServiceLocator.Current.GetInstance<ISiteDefinitionRepository>();
            var siteDefinitions = siteDefinitionRepository.List().ToArray();
            var startPage = siteDefinitions.First().StartPage;
            var productCategoryPages = new List<ProductCategoryPage>();
            var results = GetPageData(new PageReference(startPage.ID), typeof(ProductCategoryPage), language); //ContentReference.StartPage
            foreach (var pcp in results)
            {
                var category = _contentLoader.Get<ProductCategoryPage>(pcp.ContentLink.ToReferenceWithoutVersion());

                productCategoryPages.Add(category);
            }

            _eluxCache.Add(cacheKey, productCategoryPages, Platform.Models.Constant.DefaultTimeSpan, new List<ContentReference>(), new List<string>());

            return productCategoryPages;
        }

        private ProductCategoryPage GetCategoryPage(PlatformProduct item)
        {
            try
            {
                var cacheKey = $"GetCategoryPage_language.{item.Language.Name}_producttype.{item.ProductType}_parent.{item.ParentLink.ID}";

                var cpage = _eluxCache.Get<ProductCategoryPage>(cacheKey);
                if (cpage != null)
                    return cpage;

                var productCategories = GetProductCategories(item.Language.Name);
                _log.Information($"GetCategoryPage by a given product: {item.Code} with language: {item.Language.Name}. Found {productCategories.Count()} items.");

                if (productCategories.Any())
                {
                    var parent = _contentLoader.Get<IContent>(item.ParentLink);
                    var parentIds = new List<int> { item.ParentLink.ID };
                    if (parent != null && parent.ParentLink != null)
                    {
                        parentIds.Add(parent.ParentLink.ID);

                        parent = _contentLoader.Get<IContent>(parent.ParentLink);
                        if (parent != null && parent.ParentLink != null)
                        {
                            parentIds.Add(parent.ParentLink.ID);
                        }
                    }

                    ProductCategoryPage productCategoryPage = null;
                    foreach (var c in productCategories)
                    {
                        if (c.NewCategoryCollection != null && c.NewCategoryCollection.Items != null && c.NewCategoryCollection.Items.Any())
                        {
                            var fitem = c.NewCategoryCollection.Items.First();
                            if (parentIds.Contains(fitem.ContentLink.ID))
                            {
                                productCategoryPage = c;
                                break;
                            }
                        }
                    }

                    if (productCategoryPage != null)
                        _eluxCache.Add(cacheKey, productCategoryPage, Platform.Models.Constant.DefaultTimeSpan, new List<ContentReference>(), new List<string>());

                    return productCategoryPage;
                }
                _log.Error($"Not found any CategoryPage match with given product: {item.Code} - {item.Name}");
            }
            catch (Exception exception)
            {
                _log.Error($"ProductIndexingService::ProductCategoryPage Error:", exception);
            }

            return null;
        }

        private ProductCategoryPage GetCategoryPage(PlatformCategory item)
        {
            var productCategories = GetProductCategories(item.Language.Name);
            _log.Information($"GetCategoryPage by a given category: {item.Code} with language: {item.Language.Name}. Found {productCategories.Count()} items.");
            if (productCategories.Any())
            {
                var parentIds = new List<int> { item.ContentLink.ID };

                foreach (var c in productCategories)
                {
                    if (c.NewCategoryCollection != null && c.NewCategoryCollection.Items != null && c.NewCategoryCollection.Items.Any())
                    {
                        var fitem = c.NewCategoryCollection.Items.First();
                        if (parentIds.Contains(fitem.ContentLink.ID))
                        {
                            return c;
                        }
                    }
                }
            }

            _log.Error($"Not found any CategoryPage match with given category: {item.Code} - {item.Name}");
            return null;
        }

        private List<PlatformProduct> GetAllProductFromProductCategory(ContentAreaItem productCategory, ProductCategoryPage item, ref List<FilterTypeModel> productTypes)
        {
            var productList = new List<PlatformProduct>();
            try
            {
                var cacheKey = $"GetProducts_lan.{item.Language.Name}_category.{item.ContentLink.ID}_productCategory.{productCategory.ContentLink.ID}";
                var cacheData = _eluxCache.Get<ProductCacheModel>(cacheKey);
                if (cacheData != null && cacheData.Products.Count() > 0 && cacheData.ProductTypes.Count() > 0)
                {
                    productTypes = cacheData.ProductTypes;
                    return cacheData.Products;
                }

                if (productTypes == null)
                    productTypes = new List<FilterTypeModel>();

                var contentReferences = _contentLoader.GetDescendents(productCategory.ContentLink);
                foreach (var cf in contentReferences)
                {
                    _contentLoader.TryGet<PlatformProduct>(cf, out PlatformProduct product);
                    if (product != null)
                    {
                        _contentLoader.TryGet<PlatformCategory>(product.ParentLink, out PlatformCategory category);
                        var displayText = product.ProductType;
                        if (category != null)
                            displayText = category.DisplayName;

                        productList.Add(product);
                        if (!productTypes.Any(x => x.OriginalText == product.ProductType))
                            productTypes.Add(new FilterTypeModel { OriginalText = product.ProductType, DisplayText = displayText });
                    }
                }

                _eluxCache.Add(cacheKey, new ProductCacheModel { Products = productList, ProductTypes = productTypes }, Platform.Models.Constant.DefaultTimeSpan, new List<ContentReference>(), new List<string>());
                return productList;
            }
            catch (Exception ex)
            {
                return productList;
            }
        }

        public List<PlatformProduct> GetProducts(ContentReference categoryReference, ProductCategoryPage item)
        {
            var cacheKey = $"GetProducts_lan.{item.Language.Name}_category.{item.ContentLink.ID}";
            var productList = new List<PlatformProduct>();

            productList = _eluxCache.Get<List<PlatformProduct>>(cacheKey);

            if (productList == null || productList.Count() == 0)
            {
                productList = new List<PlatformProduct>();
                var contentLinks = _contentLoader.GetDescendents(categoryReference);

                foreach (var contentReference in contentLinks)
                {
                    var p = _contentLoader.Get<CatalogContentBase>(contentReference);
                    if (p is PlatformProduct)
                    {
                        productList.Add(p as PlatformProduct);
                    }
                }

                _eluxCache.Add(cacheKey, productList, Platform.Models.Constant.DefaultTimeSpan, new List<ContentReference>(), new List<string>());
            }
            return productList;
        }

        private List<Platform.Models.Commerce.V2.Attribute> GetAllProductTechspecs(List<PlatformProduct> productList)
        {
            var techspecs = new List<Platform.Models.Commerce.V2.Attribute>();
            foreach (var p in productList)
            {
                if (p.Techspecs == null || !p.Techspecs.Any())
                    continue;
                techspecs.AddRange(p.Techspecs);
            }
            return techspecs;
        }

        private IEnumerable<CapacityGroupingItem> GetCapacityGroupingItems(ProductCategoryPage item)
        {
            var cacheKey = $"GetCapacityGroupingItems_language.{item.Language.Name}_item.{item.ContentLink.ID}";
            var capacityGroupingItems = _eluxCache.Get<List<CapacityGroupingItem>>(cacheKey);
            if (capacityGroupingItems != null && capacityGroupingItems.Count() > 0)
                return capacityGroupingItems;

            //capacityGroupingItems = FetchAllCapacityGroupingByContentId(item.ContentLink.ID, item.Language.Name);

            var cnfilters = new List<CapacityGroupingItem>();
            if (item.CapacityNetLiterFilters != null && item.CapacityNetLiterFilters.Count() > 0)
            {
                foreach (var c in item.CapacityNetLiterFilters)
                {
                    cnfilters.Add(new CapacityGroupingItem { CapacityGroupingDisplayName = c.DisplayText, MinValue = c.MinValue, MaxValue = c.MaxValue, Order = c.Order });
                }
            }

            var capacityGroupingItemList = cnfilters.OrderBy(x => x.Order);

            _eluxCache.Add(cacheKey, capacityGroupingItemList, Platform.Models.Constant.DefaultTimeSpan, new List<ContentReference>(), new List<string>());

            return capacityGroupingItemList;
        }

        private List<ProductFilterViewModel> GetCategoryPageFilter(ProductCategoryPage item)
        {
            try
            {
                if (item.NewCategoryCollection == null)
                {
                    return new List<ProductFilterViewModel>();
                }
                var language = item.Language;
                var productCategory = item.NewCategoryCollection.Items.FirstOrDefault();

                var category = _contentLoader.Get<PlatformCategory>(productCategory.ContentLink);
                IEnumerable<MarketingContent> benefitsGroups = new List<MarketingContent>();
                if (category.Benefits != null)
                    benefitsGroups = category.Benefits.Where(x => x.BenefitGroupMapping != null);
                IEnumerable<Attribute> techspecFilters = new List<Attribute>();
                if (category.Techspecs != null)
                    techspecFilters = category.Techspecs.Where(x => x.IsFilter);

                var productTypes = new List<FilterTypeModel>();//new List<string>();
                //var productList = GetProducts(productCategory, item, ref productTypes);
                var productList = GetAllProductFromProductCategory(productCategory, item, ref productTypes);

                var productFilters = new List<ProductFilterViewModel>();
                //Type
                var type = new ProductFilterViewModel
                {
                    FilterTypeText = string.Empty,//typeFilterText,
                    FilterTypes = productTypes,
                    FilterKey = Platform.Models.Constant.TypeFilterKey
                };
                if (productTypes.Any())
                    productFilters.Add(type);

                // Get all techspec
                var techspecs = GetAllProductTechspecs(productList);

                // Get Capacity group
                var capacityGroupingItems = GetCapacityGroupingItems(item);

                // Techspec
                foreach (var t in techspecFilters)
                {
                    var ft = new ProductFilterViewModel();
                    if (t.AttributeName == Platform.Models.Constant.CapNetLiter && capacityGroupingItems.Any())
                    {
                        ft = new ProductFilterViewModel
                        {
                            FilterTypeEdenText = t.Name,
                            FilterTypeText = t.TranslatedName,
                            FilterTypes = capacityGroupingItems.Select(x => new FilterTypeModel { DisplayText = x.CapacityGroupingDisplayName, OriginalText = x.CapacityGroupingDisplayName }).Distinct().ToList()
                        };
                    }
                    else
                    {
                        var values = techspecs.Where(x => x.AttributeID == t.AttributeID && !string.IsNullOrEmpty(x.AttributeValue)).OrderBy(x => x.SortOrder).Select(x => x.AttributeValue).Distinct();
                        ft = new ProductFilterViewModel
                        {
                            FilterTypeEdenText = t.Name,
                            FilterTypeText = t.TranslatedName,
                            FilterTypes = values.Select(x => new FilterTypeModel { OriginalText = x, DisplayText = x }).ToList()
                        };
                    }

                    productFilters.Add(ft);
                }

                //feature
                var feature = new ProductFilterViewModel
                {
                    FilterTypeText = string.Empty,//featureText,
                    FilterTypes = new List<FilterTypeModel>(),//new List<string>(),
                    FilterKey = Platform.Models.Constant.FeatureFilterKey
                };
                foreach (var b in benefitsGroups)
                {
                    var bg = _contentRepository.Get<IContent>(b.BenefitGroupMapping);
                    if (feature.FilterTypes.Any(x => x.DisplayText == bg.Name))
                        continue;
                    feature.FilterTypes.Add(new FilterTypeModel { DisplayText = bg.Name, OriginalText = bg.Name });
                }
                if (feature.FilterTypes.Any())
                    productFilters.Add(feature);

                return productFilters;
            }
            catch (Exception ex)
            {
                return new List<ProductFilterViewModel>();
            }
        }

        private void GenerateProductTempData(PlatformProduct item, ProductCategoryPage categoryPage)
        {
            var bdata = new ProductTempData();

            try
            {
                if (item.Benefits != null && item.Benefits.Any())
                {
                    var json = JsonConvert.SerializeObject(item.Benefits);
                    bdata.BenefitsJson = json;
                }
                if (item.Features != null && item.Features.Any())
                {
                    var json = JsonConvert.SerializeObject(item.Features);
                    bdata.FeaturesJson = json;
                }
                if (item.Techspecs != null && item.Techspecs.Any())
                {
                    var json = JsonConvert.SerializeObject(item.Techspecs);
                    bdata.TechspecsJson = json;
                    var filterText = "";
                    //var techspecs = new List<string>();
                    foreach (var ts in item.Techspecs)
                    {
                        filterText += $"{ts.AttributeName.RemoveSpecialCharacter()}{ts.AttributeValue.RemoveSpecialCharacter()} __ ";
                        //techspecs.Add($"{ts.AttributeName.RemoveSpecialCharacter()}{ts.AttributeValue.RemoveSpecialCharacter()}");
                    }
                    bdata.TechSpecFilterText = filterText;
                    //bdata.TechSpecs = techspecs.ToArray();
                }
                if (item.Medias != null && item.Medias.Any())
                {
                    var json = JsonConvert.SerializeObject(item.Medias);
                    bdata.MediasJson = json;
                }
                //if (item.PI != null && item.PI.Any())
                //{
                //    var json = JsonConvert.SerializeObject(item.PI);
                //    bdata.PIJson = json;
                //}
                if (item.RelatedProducts != null && item.RelatedProducts.Any())
                {
                    var json = JsonConvert.SerializeObject(item.RelatedProducts);
                    bdata.RelatedProductsJson = json;
                }
                if (item.Facets != null && item.Facets.Any())
                {
                    var json = JsonConvert.SerializeObject(item.Facets);
                    bdata.FacetsJson = json;
                }

                var variation = _catalogContentService.GetVariants<VariationContent>(item).FirstOrDefault();
                if (variation != null)
                {
                    bdata.VariantCode = variation.Code;
                    var defaultPrice = _pricingService.GetDefaultPrice(variation.Code);
                    var price = defaultPrice?.UnitPrice ?? _pricingService.GetMoney(0);
                    bdata.Price = price.Amount;
                    bdata.PriceStr = price.Amount.ToString();

                    bdata.DifferencePriceCompareToRRP = item.RRPPrice - defaultPrice?.UnitPrice ?? _pricingService.GetMoney(0);
                    if (bdata.DifferencePriceCompareToRRP > 0)
                    {
                        bdata.RecommendedRetailPriceStr = "$" + $"{bdata.DifferencePriceCompareToRRP:##,#.00}" + " off RRP " + "$" + $"{item.RRPPrice:##,#.00}";
                    }
                    else
                    {
                        bdata.RecommendedRetailPriceStr = "";
                    }
                }

                var parentCategory = _relationRepository.GetParents<NodeEntryRelation>(item.ContentLink).FirstOrDefault();
                PlatformCategory catalog = null;
                if (parentCategory != null && !ContentReference.IsNullOrEmpty(parentCategory.Parent))
                {
                    catalog = _contentLoader.Get<PlatformCategory>(parentCategory.Parent);
                    if (catalog != null)
                        bdata.CatalogTranslatedName = catalog.Name;
                    bdata.HasParentCategory = true;
                    bdata.ProductCategoryId = catalog.ParentLink.ID;
                }

                //Store CAP_NET_LITER
                if (item.Techspecs != null && item.Techspecs.Any())
                {
                    var capNetLiter = item.Techspecs.FirstOrDefault(x => x.Name == Platform.Models.Constant.CapNetLiter);
                    if (capNetLiter != null && !string.IsNullOrEmpty(capNetLiter.AttributeValue))
                    {
                        bdata.CapacityNetLiter = int.Parse(capNetLiter.AttributeValue);
                    }
                }

                // features                
                string[] featureArr = MapBenefitsToViewString(item, true);
                bdata.FeaturesList = string.Join("|", featureArr);
                bdata.RichProductNameStr = item.RichProductName != null ? item.RichProductName.ToString() : string.Empty;
                bdata.CardDescStr = item.CardDesc != null ? item.CardDesc.ToString() : string.Empty;
                bdata.MasterLanguage = item.MasterLanguage.Name;
                bdata.ExistingLanguages = item.ExistingLanguages.Select(x => x.Name).ToArray();
                bdata.Language = item.Language.Name;

                //var categoryPage = GetCategoryPage(item);
                UpdateCapacityGroupingFilter(categoryPage, bdata);
                //UpdateCustomSortingFilter(categoryPage, bdata, item.Language.Name);

                GenerateSearchText(item, categoryPage, catalog, ref bdata);

                // Get Product detail URL
                if (categoryPage != null)
                {
                    item.Url = ProductUrlHelper.GetProductDetailUrl(item, categoryPage);
                    bdata.Url = item.Url;

                    bdata.PageCategoryId = categoryPage.ContentLink.ID;
                    bdata.HasCategoryPage = true;
                }
                else
                {
                    bdata.HasCategoryPage = false;
                }
            }
            catch (Exception exception)
            {
                _log.Error($"ProductIndexingService::GenerateProductTempData Error:", exception);
            }

            item.TempData = bdata;
        }

        private void GenerateSearchText(PlatformProduct item, ProductCategoryPage categoryPage, PlatformCategory catalog, ref ProductTempData bdata)
        {
            try
            {
                //keyword + category title(CMS) + product title(Display Name)
                if (categoryPage != null)
                {
                    var catalogDisplayName = string.Empty;
                    if (catalog != null)
                    {
                        var parent = _contentLoader.Get<PlatformCategory>(catalog.ParentLink);
                        if (parent != null)
                            catalogDisplayName = parent.DisplayName;
                    }

                    bdata.SearchText = $"{categoryPage.Keywords} {categoryPage.Name} {catalogDisplayName} {item.DisplayName}";
                }
                else
                {
                    if (catalog != null)
                    {
                        bdata.SearchText = $"{catalog.DisplayName} {item.DisplayName}";
                    }
                    else
                    {
                        bdata.SearchText = item.DisplayName;
                    }
                }
            }
            catch (Exception ex)
            {
                bdata.SearchText = item.DisplayName;
            }
        }

        private void UpdateCapacityGroupingFilter(ProductCategoryPage categoryPage, ProductTempData item)
        {
            if (categoryPage != null)
            {
                var capacityGroupingItems = GetCapacityGroupingItems(categoryPage);
                if (capacityGroupingItems != null && capacityGroupingItems.Count() > 0)
                {
                    var capacityGroupItemMathWithCapacityNetLiter = capacityGroupingItems.FirstOrDefault(x => x.MinValue < item.CapacityNetLiter && x.MaxValue >= item.CapacityNetLiter);
                    if (capacityGroupItemMathWithCapacityNetLiter != null)
                    {
                        item.CapacityNetLiterOrder = capacityGroupItemMathWithCapacityNetLiter.Order;
                    }

                }
            }
        }

        private void UpdateBenefitsForCategory(PlatformCategory item, ProductCategoryPage catPage)
        {
            var products = GetProducts(item.ContentLink, catPage);
            var benefits = new Dictionary<string, MarketingContent>();
            var hasBenefit = item.Benefits != null && item.Benefits.Count > 0;

            _log.Information($"UpdateBenefitsForCategory::There are {products.Count} products found");

            products.ForEach(x =>
            {
                var bnf = x.Benefits;
                if (bnf != null && bnf.Count > 0)
                {
                    foreach (var bitem in bnf)
                    {
                        if (!benefits.ContainsKey(bitem.Name.Trim()))
                        {
                            bitem.Picture = bitem.Picture.NormalizeUrl();

                            var markc = new MarketingContent() { IsHidden = true };

                            if (hasBenefit)
                            {
                                var existingBnf = item.Benefits.FirstOrDefault(t =>
                                    t.Name.Equals(bitem.Name, StringComparison.InvariantCultureIgnoreCase));
                                if (existingBnf != null)
                                {
                                    markc = existingBnf;
                                }
                            }

                            markc.Name = bitem.Name;
                            markc.DisplayName = bitem.DisplayName;
                            markc.FeatureTitle = bitem.FeatureTitle;
                            markc.Description = bitem.Description;
                            markc.Picture = bitem.Picture.NormalizeUrl();

                            benefits.Add(bitem.Name.Trim(), markc);
                        }
                    }
                }
            });

            item.Benefits = benefits.Values.ToArray();
            _log.Information($"UpdateBenefitsForCategory::There are {item.Benefits.Count} Benefits has been extracted");
        }

        private void UpdateTechspecsForCategory(PlatformCategory item, ProductCategoryPage catPage)
        {
            var products = GetProducts(item.ContentLink, catPage);
            var techspecs = new Dictionary<string, Attribute>();
            var hasTechSpec = item.Techspecs != null && item.Techspecs.Count > 0;

            _log.Information($"UpdateTechspecsForCategory::There are {products.Count} products found");

            products.ForEach(x =>
            {
                var ts = x.Techspecs;
                if (ts != null && ts.Count > 0)
                {
                    foreach (var attribute in ts)
                    {
                        if (!techspecs.ContainsKey(attribute.DisplayName.Trim()))
                        {
                            var attr = new Attribute() { IsHidden = true };

                            if (hasTechSpec)
                            {
                                var existingTech = item.Techspecs.FirstOrDefault(t =>
                                    t.DisplayName.Equals(attribute.DisplayName, StringComparison.InvariantCultureIgnoreCase));
                                if (existingTech != null)
                                {
                                    attr = existingTech;
                                }
                            }

                            attr.Category = attribute.Category;
                            attr.AttributeID = attribute.AttributeID;
                            attr.AttributeName = attribute.AttributeName;
                            attr.DisplayName = attribute.DisplayName;
                            attr.FriendlyName = attribute.FriendlyName;
                            attr.Name = attribute.Name;
                            attr.TranslatedName = attribute.TranslatedName;

                            techspecs.Add(attribute.DisplayName.Trim(), attr);
                        }
                    }
                }
            });

            item.Techspecs = techspecs.Values.ToArray();

            _log.Information($"UpdateTechspecsForCategory::There are {item.Techspecs.Count} Techspecs has been extracted");
        }

        #region Get Feature
        private PlatformCategory FetchPlatformCategoyContainingTechspecMaster(ProductContent PlatformProduct)
        {
            var relationCategory = _relationRepository.GetParents<NodeEntryRelation>(PlatformProduct.ContentLink).FirstOrDefault();

            if (relationCategory == null || ContentReference.IsNullOrEmpty(relationCategory.Parent))
            {
                return null;
            }

            try
            {
                var parentCategory = _contentLoader.Get<PlatformCategory>(relationCategory.Parent);
                return RecursiveFetchPlatformCategoyContainingTechspecMaster(parentCategory) ?? parentCategory;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        private PlatformCategory RecursiveFetchPlatformCategoyContainingTechspecMaster(IContent category)
        {
            if (category == null)
            {
                return null;
            }


            if (category is PlatformCategory PlatformCategory)
            {
                if (PlatformCategory.Techspecs != null && PlatformCategory.Techspecs.Count > 0)
                {
                    return PlatformCategory;
                }

                if (category.ParentLink != null)
                {
                    return RecursiveFetchPlatformCategoyContainingTechspecMaster(_contentLoader.Get<IContent>(category.ParentLink));
                }
            }
            else
            {
                if (category.ParentLink != null)
                {
                    return RecursiveFetchPlatformCategoyContainingTechspecMaster(_contentLoader.Get<IContent>(category.ParentLink));
                }
            }

            return null;
        }

        private List<ProductBenefitGroup> GetProductBenefits(PlatformProduct product, bool mapUngrouped = true)
        {
            var benefits = new List<ProductBenefitGroup>();

            var parentPage = FetchPlatformCategoyContainingTechspecMaster(product);

            var features = new List<SlideViewModel>();
            var now = DateTime.Now;
            if (product.Benefits != null && product.Benefits.Any() && parentPage.Benefits != null && parentPage.Benefits.Any())
            {
                foreach (var benefit in product.Benefits)
                {
                    if (benefit == null)
                        continue;
                    if (benefit.IsHidden)
                        continue;
                    if (benefit.ExpireDate.HasValue && benefit.ExpireDate.Value < now)
                        continue;

                    var parentBenefit = parentPage.Benefits.FirstOrDefault(x => x.AttributeID == benefit.AttributeID);
                    if (parentBenefit == null)
                        continue;

                    features.Add(new SlideViewModel()
                    {
                        Name = new XhtmlString(parentBenefit.FeatureTitle),
                        ShortDescription = new XhtmlString(parentBenefit.ShortDesc),
                        Description = parentBenefit.LongDesc,
                        ParentGroup = parentBenefit.BenefitGroupMapping,
                        IsShowOnLyticsTopics = parentBenefit.IsShowOnLytics
                    });
                }

                // store empty and add to the bottom of the benefit list
                var emptyImageList = new List<ProductBenefitGroup>();

                var mappedBenefitGroups = (features.Where(x => x.ParentGroup != null).GroupBy(x => x.ParentGroup)
                    .Select(group => new { Benefit = group.Key, Items = group.ToList() }));
                foreach (var group in mappedBenefitGroups)
                {
                    var benefitGroup = _contentLoader.Get<BenefitBlock>(group.Benefit);
                    var item = new ProductBenefitGroup
                    {
                        Name = benefitGroup.ModuleTitle,
                        FeatureList = group.Items ?? new List<SlideViewModel>()
                    };

                    if (item.FeatureList.Count == 1 && item.FeatureList.Any(f => string.IsNullOrEmpty(f.Image)))
                    {
                        emptyImageList.Add(item);
                    }
                    else
                    {
                        benefits.Add(item);
                    }
                }

                if (mapUngrouped)
                {
                    var others = features.Where(x => x.ParentGroup == null).ToList();
                    benefits.Add(new ProductBenefitGroup()
                    {
                        Name = "OTHERS",
                        IconImage = null,
                        FeatureList = others,
                    });
                }

                benefits.AddRange(emptyImageList);
            }

            return benefits;
        }

        private string[] MapBenefitsToViewString(PlatformProduct product, bool mapUngrouped = true)
        {
            var others = "OTHERS";
            var benefits = new List<string>();
            var benefitGroup = GetProductBenefits(product);
            if (benefitGroup != null && benefitGroup.Count > 0)
            {
                foreach (var benefit in benefitGroup)
                {
                    if (mapUngrouped || benefit.Name != others)
                    {
                        benefits.Add(benefit.Name.RemoveSpecialCharacter());
                    }
                }
            }

            return benefits.Where(x => x != others).ToArray();
        }
        #endregion

    }


}
