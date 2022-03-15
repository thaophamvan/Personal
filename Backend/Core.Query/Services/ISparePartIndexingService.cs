using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Globalization;
using System.Linq;
using System.Text;
using Core.Querying.Extensions;
using Core.Querying.Find.Extensions.Content;
using Core.Querying.Infrastructure.Configuration;
using Platform.Models;
using Platform.Models.CMS.Pages.SparePart;
using Platform.Models.CMS.Pages.Vintec;
using Platform.Models.CMS.Properties;
using Platform.Models.Commerce.V2;
using Platform.Models.Commerce.V3;
using Platform.Models.Commerce.Validators;
using Platform.Models.Helpers;
using Platform.Models.Models.Market;
using Platform.Models.Services.Implementation;
using Platform.Models.ViewModels.Search;
using EPiServer;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Core;
using EPiServer.Core.Internal;
using EPiServer.DataAccess;
using EPiServer.Find.Cms;
using EPiServer.Find.Helpers;
using EPiServer.Globalization;
using EPiServer.Logging;
using EPiServer.Security;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using Mediachase.Commerce;
using Mediachase.Commerce.Catalog;
using Newtonsoft.Json;

namespace Core.Querying.Services
{
    public interface ISparePartIndexingService : ILoggingService
    {
        IndexContentResult IndexOrphanPart(SparePartIndexArguments arg);
        IndexContentResult IndexVirtualPart(SparePartIndexArguments arg);
        IndexContentResult IndexFullContentFromPart(SparePartIndexArguments arg);
        IndexContentResult IndexBrandFromPartCategory(SparePartIndexArguments arg);
        IndexContentResult ReconsignContent(SparePartIndexingJobArg arg);
        IndexContentResult IncrementalReconsignContent(SparePartIncrementalReconciliationJobArg arg);

        IEnumerable<T> GetEntriesRecursive<T>(ContentReference parentLink, CultureInfo defaultCulture)
            where T : EntryContentBase;

        void UpdatePageLinkForPart(ISparePartCategoryPage previousPage, ISparePartCategoryPage currentPage, string marketId);
    }


    [ServiceConfiguration(typeof(ISparePartIndexingService))]
    public class SparePartIndexingService : ServicesBase, ISparePartIndexingService
    {
        private readonly IPncIndexingService _pncIndexingService;
        private readonly ReferenceConverter _referenceConverter;
        private readonly IPartCategoryIndexingService _partCategoryIndexingService;
        private readonly IContentRepository _contentRepository;
        private readonly IPartIndexingService _partIndexingService;
        private readonly IProductModelIndexingService _modelIndexingService;
        private readonly IContentCacheHandler _contentCache;
        private readonly SiteSettingsHandler _siteSettingsHandler;
        private readonly ISiteDefinitionResolver _siteDefinition;
        private readonly PartMarketValidatorFactory _partMarketValidatorFactory;
        public SparePartIndexingService(SiteSettingsHandler siteSettingsHandler, IPncIndexingService pncIndexingService, ReferenceConverter referenceConverter,
            IPartCategoryIndexingService partCategoryIndexingService, IContentRepository contentRepository,
            IPartIndexingService partIndexingService, IProductModelIndexingService modelIndexingService, IContentCacheHandler contentCacheHandler,
            ISiteDefinitionResolver siteDefinition, PartMarketValidatorFactory partMarketValidatorFactory)
        {
            _pncIndexingService = pncIndexingService;
            _referenceConverter = referenceConverter;
            _partCategoryIndexingService = partCategoryIndexingService;
            _contentRepository = contentRepository;
            _partIndexingService = partIndexingService;
            _modelIndexingService = modelIndexingService;
            _contentCache = contentCacheHandler;
            _siteSettingsHandler = siteSettingsHandler;
            _siteDefinition = siteDefinition;
            _partMarketValidatorFactory = partMarketValidatorFactory;
        }

        public bool UpdatePageLinkOnly { get; set; }

        #region For Indexing Data
        public IndexContentResult IndexFullContentFromPart(SparePartIndexArguments arg)
        {
            _contentCache.Clear();
            IndexContentResult result;

            if (string.IsNullOrWhiteSpace(arg.LanguageName))
            {
                result = new IndexContentResult
                {
                    Message = "Indexing has been stopped. Indexing fail cause of Language is invalid."
                };

                InvokeNotification(arg.CallbackNotification, result.Message);
                return result;
            }

            MarketId[] marketIdList;
            var brandMarketMappings = SiteSettings.Instance.GetBrandMarketMapping().Where(x => IsSparePartOrBrandSites(x.MarketId)).ToArray();

            try
            {
                marketIdList = brandMarketMappings.Select(x => new MarketId(x.MarketId)).Distinct().ToArray();
            }
            catch (Exception e)
            {
                result = new IndexContentResult
                {
                    Message = "Indexing has been stopped. Indexing fail on casting MarketId list."
                };

                Logger.Error($"SparePartIndexingService::IndexPnc ERROR {result.Message}", e);

                InvokeNotification(arg.CallbackNotification, result.Message);
                return result;
            }

            var language = new CultureInfo(arg.LanguageName);

            Logger.Error($"SparePartIndexingService::IndexPnc INFO start Indexing Parts for brands:\r\n{JsonConvert.SerializeObject(brandMarketMappings)}\r\nArguments:\r\n{JsonConvert.SerializeObject(arg)}");

            var rootPartCatalogRef = _referenceConverter.GetContentLink(arg.RootPartCategoryCode, CatalogContentType.CatalogNode);

            if (ContentReference.IsNullOrEmpty(rootPartCatalogRef))
            {
                result = new IndexContentResult
                {
                    Message = $"Indexing has been stopped. Indexing fail cause of root part catalog not found with given code: {arg.RootPartCategoryCode}."
                };

                InvokeNotification(arg.CallbackNotification, result.Message);
                return result;
            }

            if (arg.IsIncrementalIndex)
            {
                var incrementalIndexResult = IncrementalIndexingData(arg, language, brandMarketMappings, out var indexedModelList,
                    out var indexedPncList, out var indexedPartList, arg.CallbackNotification);

                return new IndexContentResult
                {
                    Status = incrementalIndexResult.Status,
                    Message = $"Indexed {indexedModelList.Count} Models, {indexedPncList.Count} PNCs, {indexedPartList.Count} Parts\r\n{incrementalIndexResult.Message}"
                };
            }

            var indexedPncs = StartIndexModelPncPart(arg, rootPartCatalogRef, language, brandMarketMappings, out var indexedModels, out var indexedParts, out var partCategoriesNeedToBeIndexed);

            partCategoriesNeedToBeIndexed = partCategoriesNeedToBeIndexed.DistinctBy(x => x.ContentLink.ID).ToList();
            var partNeedToRemoved = partCategoriesNeedToBeIndexed.Where(x => x.IsHideOnMenu).ToList();
            if (partNeedToRemoved.Any() && _partCategoryIndexingService.Delete(partNeedToRemoved))
            {
                Logger.Error($"INFO: Removed part categories: { string.Join(",", partNeedToRemoved.Select(x => x.Code))}");
            }

            IndexPartCategories(partCategoriesNeedToBeIndexed, language, marketIdList, arg.CallbackNotification, arg.IndexPageSize);


            return new IndexContentResult
            {
                Status = true,
                Message = $"Indexed {indexedModels.Count} Models, {indexedPncs.Count} PNCs, {indexedParts.Count} Parts, {partCategoriesNeedToBeIndexed.Count} Part Category pages"
            };
        }

        public IndexContentResult IndexBrandFromPartCategory(SparePartIndexArguments arg)
        {
            _contentCache.Clear();
            var rootCategories = arg.RootPartCategoryCode.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
            var totalParts = 0;
            var indexedOfTheCategory = 0;
            var language = new CultureInfo(arg.LanguageName);

            foreach (var rootCategory in rootCategories)
            {
                var rootPartCatalogRef = _referenceConverter.GetContentLink(rootCategory.Trim());

                var categories = _contentLoader.GetChildren<PartCategory>(rootPartCatalogRef, language).ToList();

                var brandMarketMappings = SiteSettings.Instance.GetBrandMarketMapping().Where(x => IsSparePartOrBrandSites(x.MarketId)).ToArray();

                foreach (var category in categories)
                {
                    Logger.Error($"IndexBrandFromPartCategory:: INFO Indexing parts in part category {category.DisplayName}-{category.ContentLink.ID}");
                    var partRefs = _contentLoader.GetDescendents(category.ContentLink);

                    var parts = _contentLoader.GetItems(partRefs, language).OfType<PartProduct>().ToList();
                    totalParts += parts.Count;

                    indexedOfTheCategory += IndexListOfParts(parts, arg, language, brandMarketMappings);

                    Logger.Error($"IndexBrandFromPartCategory:: INFO Indexed parts in part category {category.DisplayName}-{category.ContentLink.ID}.There are {indexedOfTheCategory} parts in category been indexed. Scanned parts: {totalParts}");
                }
            }


            return new IndexContentResult
            {
                Status = true,
                Message = $"Indexed {indexedOfTheCategory}/{totalParts} Parts"
            };
        }

        public IndexContentResult IndexOrphanPart(SparePartIndexArguments arg)
        {
            _contentCache.Clear();
            IndexContentResult result;

            var rootPartCatalogRef = _referenceConverter.GetContentLink(arg.RootPartCategoryCode, CatalogContentType.CatalogNode);

            if (ContentReference.IsNullOrEmpty(rootPartCatalogRef))
            {
                result = new IndexContentResult
                {
                    Message = $"Indexing has been stopped. Indexing fail cause of root part catalog not found with given code: {arg.RootPartCategoryCode}."
                };

                InvokeNotification(arg.CallbackNotification, result.Message);
                return result;
            }

            Logger.Error($"IndexOrphanPart:: INFO start indexing orphan parts");
            var brandMarketMappings = SiteSettings.Instance.GetBrandMarketMapping().Where(x => IsSparePartOrBrandSites(x.MarketId)).ToArray();
            var language = new CultureInfo(arg.LanguageName);
            var maxItemsPerBatch = 500;
            var pointer = 0;
            var canDo = true;
            var totalParts = 0;
            var indexedParts = new List<string>();
            while (canDo)
            {
                var parts = GetEntriesRecursive<PartProduct>(rootPartCatalogRef, language).Skip(pointer * maxItemsPerBatch).Take(maxItemsPerBatch).ToList();
                canDo = parts.Count == maxItemsPerBatch;
                totalParts += parts.Count;
                pointer++;
                var msg = $"{totalParts} parts have been collected at page index {pointer}";

                Logger.Error($"IndexOrphanPart:: INFO {msg}");
                InvokeNotification(arg.CallbackNotification, msg);
                var partsTobeIndexed = parts.Where(x => x.IsOrphanPart()).ToList();

                if (partsTobeIndexed.Any())
                {
                    var indexedResult = _partIndexingService.IndexOrphanParts(partsTobeIndexed, language, brandMarketMappings, arg.CallbackNotification, arg.IndexPageSize);
                    if (indexedResult.Status && indexedResult.OutData != null && indexedResult.OutData.Any())
                    {
                        indexedParts.AddRange(indexedResult.OutData.Where(x => x is PartProduct).Select(x => (x as PartProduct)).Select(x => $"{x.PartNumber}-{x.ContentLink.ID}").ToList());

                        InvokeNotification(arg.CallbackNotification, $"{indexedResult.OutData.Count} parts have been indexed.");
                    }
                }

            }

            Logger.Error($"IndexOrphanPart:: Indexed {indexedParts.Count} orphan parts in total {totalParts} parts. Detail indexed items:\r\n{JsonConvert.SerializeObject(indexedParts)}");

            result = new IndexContentResult
            {
                Message = $" Indexed {indexedParts.Count} orphan parts in total {totalParts} parts. See log for detail indexed items."
            };

            InvokeNotification(arg.CallbackNotification, result.Message);

            return result;
        }

        public IndexContentResult IndexVirtualPart(SparePartIndexArguments arg)
        {
            _contentCache.Clear();
            var marketBrandMapping = SiteSettings.Instance.GetBrandMarketMapping()
                .Where(x => IsSparePartOrBrandSites(x.MarketId)).ToList();
            var markets = marketBrandMapping.Select(x => x.MarketId).Distinct().Select(x => new MarketId(x)).ToArray();

            var maxItemsPerBatch = 500;
            var modelRefs = arg.VirtualModels.Select(x => _referenceConverter.GetContentLink(x)).Where(x => !ContentReference.IsNullOrEmpty(x)).ToList();
            var models = _contentLoader.GetItems(modelRefs, new CultureInfo(arg.LanguageName)).OfType<ModelProduct>().ToList();
            List<string> indexedParts = new List<string>();

            var totalParts = 0;
            foreach (var model in models)
            {
                var pnc = _contentLoader.Get<PncProduct>(model.GetVariants().FirstOrDefault());
                if (pnc != null)
                {
                    var pointer = 0;
                    var canDo = true;
                    while (canDo)
                    {
                        var pncAssociations = pnc.GetAssociations().Select(x => x.Target).Skip(pointer * maxItemsPerBatch)
                            .Take(maxItemsPerBatch).ToList();

                        canDo = pncAssociations.Count == maxItemsPerBatch;

                        var parts = _contentLoader.GetItems(pncAssociations, pnc.Language).OfType<PartProduct>().Where(x => x.IsVirtualPart()).ToList();

                        totalParts += parts.Count;
                        pointer++;
                        foreach (var partProduct in parts)
                        {
                            var partKey = $"{partProduct.PartNumber}\t{partProduct.ContentLink.ID}";
                            indexedParts.Add(partKey);
                        }
                        _partIndexingService.IndexVirtualParts(parts, new CultureInfo(arg.LanguageName), markets, arg.CallbackNotification, arg.IndexPageSize);
                    }
                }
            }
            Logger.Error($"\r\nIndexed Parts: \r\n{JsonConvert.SerializeObject(indexedParts)}");
            return new IndexContentResult
            {
                Status = true,
                Message = $"Indexed Virtual Models. Indexed parts: {totalParts}"
            };
        }

        private IndexContentResult IncrementalIndexingData(SparePartIndexArguments arg, CultureInfo language,
            BrandMarketMapping[] brandMarketMappings, out List<string> indexedModels, out List<string> indexedPncs,
            out List<string> indexedParts, Func<string, bool> argCallbackNotification)
        {
            var models = SqlHelper.Instance.GetAllIncrementalCodesByType(ImportConstants.Parameter.ModelCodesKey).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToList();
            var pncs = SqlHelper.Instance.GetAllIncrementalCodesByType(ImportConstants.Parameter.PncCodesKey).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToList();
            var parts = SqlHelper.Instance.GetAllIncrementalCodesByType(ImportConstants.Parameter.PartCodesKey).Where(x => !string.IsNullOrWhiteSpace(x)).Distinct().ToList();
            indexedModels = new List<string>();
            indexedPncs = new List<string>();
            indexedParts = new List<string>();

            var result = new IndexContentResult();
            result.Status = true;

            //INDEX PARTS
            if (parts != null && parts.Any())
            {
                InvokeNotification(argCallbackNotification, $"Started Incremental indexing for {parts.Count} parts...");
                var partsIndexedResult = IndexIncrementalPartContents(arg, language, brandMarketMappings, parts, argCallbackNotification);
                if (!partsIndexedResult.Status)
                {
                    result.Status = false;
                    result.Message = $"\r\n{partsIndexedResult.Message}";
                }
                Logger.Error($"IncrementalIndexingData:: INFO indexed parts result: {partsIndexedResult.Message}, status: {partsIndexedResult.Status}:\r\n{string.Join(",", partsIndexedResult.OutData.Select(x => x.ContentLink.ID))}");
                indexedParts.AddRange(partsIndexedResult.OutData.Select(x => x.ContentLink.ID.ToString()));
            }
            else
            {
                Logger.Error($"IncrementalIndexingData:: INFO there is NO part to be indexed");
            }

            //INDEX PNCs
            if (pncs != null && pncs.Any())
            {
                InvokeNotification(argCallbackNotification, $"Started Incremental indexing for {pncs.Count} PNCs...");

                var pncsIndexedResult = IndexIncrementalPncContents(arg, language, brandMarketMappings, pncs);
                if (!pncsIndexedResult.Status)
                {
                    result.Status = false;
                    result.Message += $"\r\n{pncsIndexedResult.Message}";
                }
                Logger.Error($"IncrementalIndexingData:: INFO indexed PNCs result: {pncsIndexedResult.Message}, status: {pncsIndexedResult.Status}:\r\n{string.Join(",", pncsIndexedResult.OutData.Select(x => x.Name + "-" + x.ContentLink.ID))}");
                indexedPncs.AddRange(pncsIndexedResult.OutData.Select(x => x.ContentLink.ID.ToString()));
            }
            else
            {
                Logger.Error($"IncrementalIndexingData:: INFO there is NO PNC to be indexed");
            }

            //INDEX MODELs
            if (models != null && models.Any())
            {
                InvokeNotification(argCallbackNotification, $"Started Incremental indexing for {models.Count} Models...");

                var modelIndexedList = IndexIncrementalModelContents(arg, language, brandMarketMappings, models);
                if (!modelIndexedList.Status)
                {
                    result.Status = false;
                    result.Message += $"\r\n{modelIndexedList.Message}";
                }
                Logger.Error($"IncrementalIndexingData:: INFO indexed Models result: {modelIndexedList.Message}, status: {modelIndexedList.Status}:\r\n{string.Join(",", modelIndexedList.OutData.Select(x => x.Name + "-" + x.ContentLink.ID))}");
                indexedModels.AddRange(modelIndexedList.OutData.Select(x => x.ContentLink.ID.ToString()));

            }
            else
            {
                Logger.Error($"IncrementalIndexingData:: INFO there is NO Model to be indexed");
            }

            return result;
        }
        private IndexContentResult IndexIncrementalModelContents(SparePartIndexArguments arg, CultureInfo language,
            BrandMarketMapping[] brandMarketMappings, List<string> modelList)
        {
            var contentRefs = modelList.Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => _referenceConverter.GetContentLink(x, CatalogContentType.CatalogEntry))
                .Where(x => !ContentReference.IsNullOrEmpty(x));

            if (!contentRefs.Any())
            {
                return new IndexContentResult
                {
                    Status = true,
                    Message = "No Model found to index!"
                };
            }

            var models = _contentLoader.GetItems(contentRefs, language).OfType<ModelProduct>().ToList();
            var modelIndexedResult = _modelIndexingService.IndexModels(models, language, brandMarketMappings, arg.CallbackNotification, arg.IndexPageSize);
            return modelIndexedResult;
        }

        private IndexContentResult IndexIncrementalPncContents(SparePartIndexArguments arg, CultureInfo language,
            BrandMarketMapping[] brandMarketMappings, List<string> pncList)
        {
            var contentRefs = pncList.Where(x => !string.IsNullOrWhiteSpace(x))
                .Select(x => _referenceConverter.GetContentLink(x, CatalogContentType.CatalogEntry))
                .Where(x => !ContentReference.IsNullOrEmpty(x));

            if (!contentRefs.Any())
            {
                return new IndexContentResult
                {
                    Status = true,
                    Message = "No PNC found to index!"
                };
            }

            var pncs = _contentLoader.GetItems(contentRefs, language).OfType<PncProduct>().ToList();

            if (arg.Markets != null && arg.Markets.Any())
            {
                pncs = pncs.Where(x => x.ModelsList.Any(p => arg.Markets.Contains(p.MarketId))).ToList();
            }

            var pncIndexedResult = _pncIndexingService.IndexPnc(pncs, language, brandMarketMappings, arg.CallbackNotification, arg.IndexPageSize);
            return pncIndexedResult;
        }

        private IndexContentResult IndexIncrementalPartContents(SparePartIndexArguments arg, CultureInfo language,
            BrandMarketMapping[] brandMarketMappings, List<string> parts, Func<string, bool> argCallbackNotification)
        {
            var markets = brandMarketMappings.Select(x => new MarketId(x.MarketId)).DistinctBy(x => x.Value);

            var partContentRefs =
                parts.Select(x => _referenceConverter.GetContentLink(x, CatalogContentType.CatalogEntry)).Where(x => !ContentReference.IsNullOrEmpty(x)).ToList();

            List<string> indexedParts = new List<string>();
            var indexedResult = new IndexContentResult();
            indexedResult.OutData = new List<IContent>();
            indexedResult.Message = $"IndexIncrementalPartContents:: Query {parts.Count} parts to index but not found any relevant!";

            var canDo = true;
            var maxItems = 100;
            var idx = 0;

            while (canDo)
            {
                var partsBatch = partContentRefs.Skip(idx * maxItems).Take(maxItems).ToList();
                canDo = partsBatch.Count == maxItems;
                idx++;

                if (partsBatch.Any())
                {
                    var partCodesToDelete = new List<string>();
                    var partList = _contentLoader.GetItems(partsBatch, language).OfType<PartProduct>().ToList();
                    var virtualList = new List<PartProduct>();
                    var nonVirtualList = new List<PartProduct>();
                    var orphanList = new List<PartProduct>();
                    var removeParts = new List<PartProduct>();
                    if (arg.Markets != null && arg.Markets.Any())
                    {
                        partList = partList.Where(x => x.ModelPageList != null && x.ModelPageList.Any(p => arg.Markets.Contains(p.MarketId))).ToList();
                    }

                    foreach (var part in partList)
                    {
                        var partKey = $"{part.PartNumber}\t{part.ContentLink.ID}";

                        //if (!part.Displayable(markets.ToArray(), out var displayableDetails))
                        //{
                        //    var displayInfo = string.Join(",", displayableDetails.Where(x => !x.Displayable).Select(x => $"{x.MarketId.Value}-{x.Reason}"));

                        //    InvokeNotification(argCallbackNotification, $"Skipped {partKey} cause of Displayable is false:{displayInfo}");
                        //    Logger.Error($"IndexIncrementalPartContents:: WARN Skipped {partKey} cause of Displayable is false:{displayInfo}");
                        //    removeParts.Add(part);
                        //    continue;
                        //}

                        if (part.ModelNumberListLinks == null || !part.ModelNumberListLinks.Any())
                        {
                            InvokeNotification(argCallbackNotification, $"Skipped {partKey} cause of ModelNumberListLinks is null or empty.");
                            Logger.Error($"IndexIncrementalPartContents:: WARN Skipped {partKey} cause of ModelNumberListLinks is null or empty.");
                            removeParts.Add(part);
                            continue;
                        }

                        indexedParts.Add(partKey);

                        if (part.IsVirtualPart())
                        {
                            virtualList.Add(part);
                        }
                        else if (part.IsOrphanPart())
                        {
                            orphanList.Add(part);
                        }
                        else
                        {
                            nonVirtualList.Add(part);
                        }
                    }

                    _partIndexingService.RemoveParts(removeParts, argCallbackNotification);

                    if (virtualList.Any())
                    {
                        var r = _partIndexingService.IndexVirtualParts(virtualList.ToList(), language, markets.ToArray(), arg.CallbackNotification, arg.IndexPageSize);
                        if (r.Status)
                        {
                            partCodesToDelete.AddRange(r.OutData.Cast<PartProduct>().Select(x => x.Code).ToList());
                            indexedResult.OutData = r.OutData.Concat(indexedResult.OutData).ToList();
                        }
                    }

                    if (orphanList.Any())
                    {
                        var r = _partIndexingService.IndexOrphanParts(orphanList.ToList(), language, brandMarketMappings, arg.CallbackNotification, arg.IndexPageSize);
                        if (r.Status)
                        {
                            partCodesToDelete.AddRange(r.OutData.Cast<PartProduct>().Select(x => x.Code).ToList());
                            indexedResult.OutData = r.OutData.Concat(indexedResult.OutData).ToList();
                        }
                    }

                    if (nonVirtualList.Any())
                    {
                        var r = _partIndexingService.IndexParts(nonVirtualList.ToList(), language, markets.ToArray(), arg.CallbackNotification, arg.IndexPageSize);
                        if (r.Status)
                        {
                            partCodesToDelete.AddRange(r.OutData.Cast<PartProduct>().Select(x => x.Code).ToList());
                            indexedResult.OutData = r.OutData.Concat(indexedResult.OutData).ToList();
                        }
                    }

                    if (partCodesToDelete.Any())
                    {
                        InvokeNotification(argCallbackNotification, $"Indexed batch no: {idx} with {partCodesToDelete.Count} parts");
                        SqlHelper.Instance.DeleteAllIncrementalCodesByCode(partCodesToDelete);
                    }
                }
            }


            Logger.Error($"\r\nIndexed Parts: \r\n{JsonConvert.SerializeObject(indexedParts)}");

            indexedResult.Status = true;
            indexedResult.Message = $"IndexIncrementalPartContents:: Indexed {indexedParts.Count} parts";

            return indexedResult;
        }

        /// <summary>
        /// Loop all the sub categories from given rootPartCatalogRef to recusive gathering parts, check and index them. Out list of part categories need to be indexed and indexed part codes.
        /// </summary>
        /// <param name="arg"></param>
        /// <param name="rootPartCatalogRef"></param>
        /// <param name="language"></param>
        /// <param name="brandMarketMappings"></param>
        /// <param name="indexedModels"></param>
        /// <param name="indexedParts"></param>
        /// <param name="partCategoriesNeedToBeIndexed"></param>
        /// <returns></returns>
        private List<string> StartIndexModelPncPart(SparePartIndexArguments arg, ContentReference rootPartCatalogRef, CultureInfo language, BrandMarketMapping[] brandMarketMappings,
            out List<string> indexedModels, out List<string> indexedParts, out List<PartCategory> partCategoriesNeedToBeIndexed)
        {

            indexedModels = new List<string>();
            indexedParts = new List<string>();
            partCategoriesNeedToBeIndexed = new List<PartCategory>();
            var maxItemsPerBatch = 500;
            var indexedPncs = new List<string>();
            var skippedParts = new List<string>();
            var totalParts = 0;

            var categories = _contentLoader.GetChildren<PartCategory>(rootPartCatalogRef, language).ToList();
            if (arg.TemPartsCategoryId > 0)
            {
                categories = categories.Where(x => x.ContentLink.ID != arg.TemPartsCategoryId).ToList();
            }

            foreach (var category in categories)
            {
                Logger.Error($"IndexFullContentFromPart:: INFO Indexing for part category {category.DisplayName}-{category.ContentLink.ID}");

                var pointer = 0;
                var canDo = true;
                var indexedOfTheCategory = 0;
                while (canDo)
                {
                    var parts = GetEntriesRecursive<PartProduct>(category.ContentLink, language).Skip(pointer * maxItemsPerBatch)
                        .Take(maxItemsPerBatch).ToList();
                    canDo = parts.Count == maxItemsPerBatch;
                    totalParts += parts.Count;
                    pointer++;

                    if (arg.Markets != null && arg.Markets.Any())
                    {
                        parts = parts.Where(x => x.ModelPageList != null && x.ModelPageList.Any(p => arg.Markets.Contains(p.MarketId))).ToList();
                    }

                    indexedOfTheCategory += IndexListOfParts(parts, arg, language, brandMarketMappings, indexedModels, indexedPncs, indexedParts, skippedParts, ref partCategoriesNeedToBeIndexed);
                }

                Logger.Error($"IndexFullContentFromPart:: INFO Indexed for part category {category.DisplayName}-{category.ContentLink.ID}.There are {indexedOfTheCategory} parts in category been indexed. Scanned parts: {totalParts}, skipped parts: {skippedParts.Count}, indexed parts: {indexedParts.Count}");
            }

            Logger.Error($"Indexed {indexedModels.Count} Models, {indexedPncs.Count} PNCs, {indexedParts.Count} Parts, skipped {skippedParts.Count} Parts, Total Parts: {totalParts}.\r\nStart indexing part categories...");
            Logger.Error($"\r\nIndexed Parts: \r\n{JsonConvert.SerializeObject(indexedParts)}");
            Logger.Error($"\r\nIndexed PNCs: \r\n{JsonConvert.SerializeObject(indexedPncs)}");
            Logger.Error($"\r\nIndexed Models: \r\n{JsonConvert.SerializeObject(indexedModels)}");
            Logger.Error($"\r\nSkipped Parts: \r\n{JsonConvert.SerializeObject(skippedParts)}");
            return indexedPncs;
        }

        private int IndexListOfParts(List<PartProduct> parts, SparePartIndexArguments arg, CultureInfo language, BrandMarketMapping[] brandMarketMappings,
            List<string> indexedModels, List<string> indexedPncs, List<string> indexedParts, List<string> skippedParts,
            ref List<PartCategory> partCategoriesNeedToBeIndexed)
        {
            var marketIdList = brandMarketMappings.Select(x => new MarketId(x.MarketId)).DistinctBy(x => x.Value).ToArray();
            var virtualList = new List<PartProduct>();
            var orphanList = new List<PartProduct>();
            var noneVirtualOrphanList = new List<PartProduct>();

            foreach (var partProduct in parts)
            {
                var partKey = $"{partProduct.PartNumber}\t{partProduct.ContentLink.ID}";

                //Skip the indexed parts
                if (indexedParts.Any(x => x.Equals(partKey)) || skippedParts.Any(x => x.StartsWith($"{partKey}\t")))
                {
                    continue;
                }

                indexedParts.Add(partKey);

                //Skip all parts that belong to virtual model
                var isVirtualPart = partProduct.IsVirtualPart();
                var isOrphanPart = partProduct.IsOrphanPart();

                if (isVirtualPart)
                {
                    virtualList.Add(partProduct);
                }
                else if (isOrphanPart)
                {
                    orphanList.Add(partProduct);
                }
                else
                {
                    noneVirtualOrphanList.Add(partProduct);
                }

                var partDisplayable = _partMarketValidatorFactory.Displayable(partProduct, marketIdList, out var partDisplayDetails);

                if (arg.IndexPartCategoriesOnly)
                {

                    if (partDisplayable && !isVirtualPart && !isOrphanPart)
                    {
                        var catsDetail = partProduct.DisplayableCategories();

                        GatherPartCategoryToBeIndexed(ref partCategoriesNeedToBeIndexed, catsDetail, partProduct, partDisplayDetails);
                    }
                    continue;
                }

                if (!isVirtualPart && !isOrphanPart)
                {
                    var catsDetail = partProduct.DisplayableCategories();

                    GatherPartCategoryToBeIndexed(ref partCategoriesNeedToBeIndexed, catsDetail, partProduct, partDisplayDetails);

                    if (partProduct.ModelNumberListLinks != null && partProduct.ModelNumberListLinks.Any())
                    {
                        var modelsCanBeIndexed = partProduct.ModelNumberListLinks.Where(x =>
                                !string.IsNullOrWhiteSpace(x.MarketId) && !string.IsNullOrWhiteSpace(x.Code) && brandMarketMappings.Any(m =>
                                    m.MarketId.Equals(x.MarketId, StringComparison.InvariantCultureIgnoreCase)) &&
                                !indexedModels.Any(m => m.Equals(x.Code, StringComparison.InvariantCultureIgnoreCase)))
                            .Select(x => x.EntryId)
                            .ToList();

                        var modelRefs = modelsCanBeIndexed.Select(x => _referenceConverter.GetContentLink(x, CatalogContentType.CatalogEntry, 0))
                            .Where(x => !ContentReference.IsNullOrEmpty(x)).ToList();

                        var models = _contentLoader.GetItems(modelRefs, language).OfType<ModelProduct>().Where(x => !x.IsVirtualModel).ToList();

                        var result = _modelIndexingService.IndexModels(models, language, brandMarketMappings, arg.CallbackNotification, arg.IndexPageSize);
                        if (!result.Status)
                        {
                            indexedModels.AddRange(result.OutData.Select(x => (x as ModelProduct).ModelNumber));
                        }
                        else
                        {
                            indexedModels.AddRange(models.Select(x => x.ModelNumber));
                        }
                    }

                    if (partProduct.PncNumberListLinks != null && partProduct.PncNumberListLinks.Any())
                    {
                        var pncCanBeIndexed = partProduct.PncNumberListLinks.Where(x =>
                                !string.IsNullOrWhiteSpace(x.MarketId) && brandMarketMappings.Any(m =>
                                    m.MarketId.Equals(x.MarketId, StringComparison.InvariantCultureIgnoreCase)) &&
                                !indexedPncs.Any(m => m.Equals(x.Code, StringComparison.InvariantCultureIgnoreCase)))
                            .Select(x => x.EntryId)
                            .ToList();
                        var pncRefs = pncCanBeIndexed.Select(x => _referenceConverter.GetContentLink(x, CatalogContentType.CatalogEntry, 0))
                            .Where(x=>!ContentReference.IsNullOrEmpty(x)).ToList();
                        var pncs = _contentLoader.GetItems(pncRefs, language).OfType<PncProduct>().Where(x => !x.IsVirtual).ToList();

                        //Index the PNC in the indicated markets only
                        if (arg.Markets != null && arg.Markets.Any())
                        {
                            pncs = pncs.Where(x => x.ModelsList.Any(p => arg.Markets.Contains(p.MarketId))).ToList();
                        }

                        var result = _pncIndexingService.IndexPnc(pncs, language, brandMarketMappings, arg.CallbackNotification, arg.IndexPageSize);
                        if (!result.Status)
                        {
                            indexedPncs.AddRange(result.OutData.Select(x => (x as PncProduct).PNC));
                        }
                        else
                        {
                            indexedPncs.AddRange(pncs.Select(x => x.PNC));
                        }
                    }
                }
            }

            if (!arg.IndexPartCategoriesOnly)
            {
                if (virtualList.Any())
                {
                    _partIndexingService.IndexVirtualParts(virtualList, language, marketIdList, arg.CallbackNotification, arg.IndexPageSize);
                }

                if (orphanList.Any())
                {
                    _partIndexingService.IndexOrphanParts(orphanList, language, brandMarketMappings, arg.CallbackNotification, arg.IndexPageSize);
                }

                if (noneVirtualOrphanList.Any())
                {
                    _partIndexingService.IndexParts(noneVirtualOrphanList, language, marketIdList, arg.CallbackNotification, arg.IndexPageSize);
                }
            }

            return indexedParts.Count;
        }

        private void GatherPartCategoryToBeIndexed(ref List<PartCategory> partCategoriesNeedToBeIndexed, PartCategory[] catsDetail,
            PartProduct partProduct, MarketDisplayable[] partDisplayableDetails)
        {
            var displayableMarkets = partDisplayableDetails.Where(x => x.Displayable).ToList();

            //Select the model page links which are displayable from part only. Add them into category to index and indicate markets of the category can be displayed
            var modelPageList = partProduct.ModelPageList.Where(x => !string.IsNullOrWhiteSpace(x.ModelCategoryCode) && displayableMarkets.Any(p => p.MarketId == x.MarketId)).ToList();
            if (!modelPageList.Any())
            {
                return;
            }

            foreach (var item in catsDetail)
            {
                var existingItem = partCategoriesNeedToBeIndexed.FirstOrDefault(x => x.ContentLink.Equals(item.ContentLink));
                if (existingItem != null)
                {
                    existingItem.ModelPageListFromParts = existingItem.ModelPageListFromParts.Concat(modelPageList).DistinctBy(x => x.PageId).ToList();
                }
                else
                {
                    existingItem = item;
                    existingItem.ModelPageListFromParts = modelPageList;
                    partCategoriesNeedToBeIndexed.Add(existingItem);
                }
            }
        }

        private int IndexListOfParts(List<PartProduct> parts, SparePartIndexArguments arg, CultureInfo language, BrandMarketMapping[] brandMarketMappings)
        {
            var markets = brandMarketMappings.Select(x => new MarketId(x.MarketId)).DistinctBy(x => x.Value).ToArray();
            var removeParts = parts.Where(x => x.IsStopped()).ToList();
            var indexParts = parts.Where(x => !x.IsStopped()).ToList();

            _partIndexingService.IndexParts(indexParts, language, markets, arg.CallbackNotification, arg.IndexPageSize);
            _partIndexingService.RemoveParts(removeParts, arg.CallbackNotification);

            return indexParts.Count;
        }

        private void IndexPartCategories(List<PartCategory> partCategories, CultureInfo language,
            MarketId[] marketIdList, Func<string, bool> argCallbackNotification, int pageIndexSize)
        {
            Logger.Error($"IndexPartCategories:: INFO There are {partCategories.Count()} Part categories need to process...");

            var partCategoriesToShow = partCategories.Where(x => !x.IsHideOnMenu).ToList();

            var accessoryCategories = partCategoriesToShow.Where(x => x.IsAccessory).ToList();
            var remainingCategories = partCategoriesToShow.Where(x => !x.IsAccessory);
            var categoriesNeedToBeIndexed = new List<PartCategory>();

            foreach (var category in remainingCategories)
            {
                var parents = _contentLoader.GetItems(category.GetCategories().Append(category.ParentLink), language)
                    .Where(x => x is PartCategory && !(x as PartCategory).IsHideOnMenu).Cast<PartCategory>().ToList();
                if (parents.Any())
                {
                    categoriesNeedToBeIndexed.AddRange(parents);
                }
                else
                {
                    categoriesNeedToBeIndexed.Add(category);
                }
            }
            categoriesNeedToBeIndexed = categoriesNeedToBeIndexed.Concat(accessoryCategories).ToList();

            Logger.Error($"IndexPartCategories:: INFO There are {categoriesNeedToBeIndexed.Count} Part categories need to be indexed...");
            _partCategoryIndexingService.IndexPartCategories(categoriesNeedToBeIndexed.ToArray(), language, marketIdList, argCallbackNotification, pageIndexSize);


        }

        #endregion

        #region For Reconciling data

        public IndexContentResult ReconsignContent(SparePartIndexingJobArg arg)
        {
            UpdatePageLinkOnly = arg.UpdateModelPageLinkOnly;

            #region Validate input data and prepare to start reconciling

            Logger.Error($"SparePartIndexingService::ReconsignContent INFO start reconciling content with Update Model Page Link = {UpdatePageLinkOnly} and Temp Parts ID = {arg.TempPartsCategoryId}...");
            var modelContentReference = _referenceConverter.GetContentLink(arg.RootModelCategoryCode, CatalogContentType.CatalogNode);
            var partContentReference = _referenceConverter.GetContentLink(arg.RootPartCategoryCode, CatalogContentType.CatalogNode);

            if (ContentReference.IsNullOrEmpty(modelContentReference) || ContentReference.IsNullOrEmpty(partContentReference))
            {
                var result = new IndexContentResult
                {
                    Message = "Reconciling Content has been stopped. Root Model Catalog Code or Root Part Catalog Code is invalid."
                };

                Logger.Error($"SparePartIndexingService::ReconsignContent INFO {result.Message}");

                InvokeNotification(arg.CallbackNotification, result.Message);
                return result;
            }

            var language = new CultureInfo(arg.LanguageName);
            ISparePartCategoryPage[] catPages = GetModelCategoryPages(language, _contentLoader.GetDescendents(SiteDefinition.Current.RootPage).ToArray());

            if (!catPages.Any())
            {

                var result = new IndexContentResult
                {
                    Message = "Reconciling Content job has been stopped. Indexing fail cause of no product category page found."
                };

                Logger.Error($"SparePartIndexingService::ReconsignContent INFO {result.Message}");

                InvokeNotification(arg.CallbackNotification, result.Message);
                return result;
            }

            InvokeNotification(arg.CallbackNotification, $"Start Reconciling for {catPages.Count()} categories: {string.Join(", ", catPages.Select(x => x.Name))}");

            var marketBrandMapping = SiteSettings.Instance.GetBrandMarketMapping().Where(x => IsSparePartOrBrandSites(x.MarketId)).ToList();

            var metaFields = GetMetaFields();

            #endregion

            //1. Remove existing associations and linked model/pnc of Parts if needed
            //2. Remove existing association of Part Categories if needed
            //3. Remove/Add Model Numbers into PNC (the models that PNC belong to)
            //4. Add Model Numbers, PNC Numbers, Model Listing Page into part and Model listing pages into Part Categories
            //5. Add Association Models, PNCs to Parts

            int[] partCategoryIds = null;

            if (arg.RemovePartAssociation)
            {
                //1. Just in case wanted to clear all the association of parts to models, pnc. This is to cleaning relationship.
                InvokeNotification(arg.CallbackNotification, $"Removing Associations Part...");
                RemoveAssociationsOfPartBySql(partContentReference, language, arg.TempPartsCategoryId, out partCategoryIds);
                System.GC.Collect();
            }

            if (arg.RemovePartCategoryAssociation)
            {
                //2. Just in case wanted to clear all the association of Part category to model listing pages. This is to cleaning relationship.
                InvokeNotification(arg.CallbackNotification, $"Removing Associations of Part Category...");
                partCategoryIds = partCategoryIds ?? GetNodesRecursive<PartCategory>(partContentReference, language).Where(x => x.ContentLink.ID != arg.TempPartsCategoryId).Select(x => x.ContentLink.ID).ToArray();
                RemoveAssociationsOfPartCategoryBySql(partCategoryIds);
                System.GC.Collect();
            }

            //If UpdatePartBaseOnRelational only then skip this step
            if (!arg.UpdatePartBaseOnRelational)
            {
                if (arg.FromStep == 0 || arg.FromStep == 1)
                {
                    //3. Add brands from Models to the PNC which is child of model
                    InvokeNotification(arg.CallbackNotification, $"Updating model link of PNC (PNC-> Model)...");
                    UpdateAssociationsOfPnc(catPages, marketBrandMapping, metaFields, language);
                    System.GC.Collect();
                }

                if (arg.FromStep == 0 || arg.FromStep == 2)
                {
                    var modelCategories = GetModelCategoriesFromModelPages(catPages);
                    System.GC.Collect();

                    //4. Add relationship (association) from part to Models, Pncs, Model Listing Page and Add model listing page into Part Category based on Part
                    InvokeNotification(arg.CallbackNotification, $"Updating Associations and PNC/Model/Model Page links of Part...");
                    UpdateAssociationOfPartWithPncAndModelBySql(modelContentReference, modelCategories, marketBrandMapping, language, arg.TempModelsCategoryId, arg.TempPartsCategoryId, metaFields, arg.CallbackNotification);
                    System.GC.Collect();
                }
            }

            ReconsignBrandContent(catPages);

            if (arg.UpdatePartNameOnly)
            {
                var processedItems = StandardizationPartName(partContentReference, marketBrandMapping, language, arg.TempPartsCategoryId);
                System.GC.Collect();

                return new IndexContentResult
                {
                    Status = true,
                    Message = $"Done without problems. There are {processedItems} part has been updated!"
                };
            }

            return new IndexContentResult
            {
                Status = true,
                Message = "Done without problems."
            };
        }

        private void ReconsignBrandContent(ISparePartCategoryPage[] catPages)
        {
            var brandCategoryPages = catPages.Where(x => x is VintecCategoryPage || x is SparePartUniluxCategoryPage);
            var siteSettingPages = _siteSettingsHandler.GetSiteMarketSettings();
            foreach (var page in brandCategoryPages)
            {
                var site = _siteDefinition.GetByContent(page.ContentLink, false);
                var siteId = site.Id;
                var settingPage = siteSettingPages.FirstOrDefault(x => x.Value.SiteId() == siteId.ToString());
                if (settingPage.Value != null)
                {
                    UpdatePageLinkForPart(null, page, settingPage.Value.MarketId);
                }
            }

        }

        public IndexContentResult IncrementalReconsignContent(SparePartIncrementalReconciliationJobArg arg)
        {
            var language = new CultureInfo(arg.LanguageName);
            var pageLinks = arg.ModelCategoryPages.Select(x => _referenceConverter.GetContentLink(x))
                .Where(x => !ContentReference.IsNullOrEmpty(x)).ToArray();

            ISparePartCategoryPage[] catPages = GetModelCategoryPages(language, pageLinks);

            if (!catPages.Any())
            {

                var result = new IndexContentResult
                {
                    Message = "Incremental Reconciling Content job has been stopped. Indexing fail cause of no product category page found."
                };

                Logger.Error($"SparePartIndexingService::IncrementalReconsignContent INFO {result.Message}");

                InvokeNotification(arg.CallbackNotification, result.Message);
                return result;
            }

            InvokeNotification(arg.CallbackNotification, $"Start Incremental Reconciling for {catPages.Count()} categories: {string.Join(", ", catPages.Select(x => x.Name))}");

            var marketBrandMapping = SiteSettings.Instance.GetBrandMarketMapping().Where(x => IsSparePartOrBrandSites(x.MarketId)).ToList();

            return null;
        }

        public void UpdatePageLinkForPart(ISparePartCategoryPage previousPage, ISparePartCategoryPage currentPage, string marketId)
        {
            IEnumerable<ContentReference> previousCategories = new List<ContentReference>();
            IEnumerable<ContentReference> allcategories;

            if (previousPage != null)
            {
                previousCategories = previousPage.NewCategoryCollection != null && previousPage.NewCategoryCollection.FilteredItems.Any()
                ? previousPage.NewCategoryCollection.FilteredItems.Select(x => x.ContentLink)
                : new List<ContentReference>();
            }


            var currentCategories = currentPage.NewCategoryCollection != null && currentPage.NewCategoryCollection.FilteredItems.Any()
                ? currentPage.NewCategoryCollection.FilteredItems.Select(x => x.ContentLink)
                : new List<ContentReference>();
            var sitesDefinition = _siteSettingsHandler.ListSitesDefinition();
            allcategories = currentCategories.Concat(previousCategories);

            List<string> partListNeedRemoveModelPageLink = new List<string>();

            if (allcategories.Any())
            {
                var partList = new List<PartProduct>();
                foreach (var categoryRef in allcategories)
                {
                    var partRefs = _contentLoader.GetDescendents(categoryRef).ToList();
                    var parts = _contentLoader.GetItems(partRefs, (currentPage as PageData).Language).OfType<PartProduct>().ToList();
                    if (parts.Any())
                    {
                        partList.AddRange(parts);
                    }
                    if (previousCategories.Any() && !currentCategories.Any(e => e.ID.Equals(categoryRef.ID)))
                    {
                        partListNeedRemoveModelPageLink.AddRange(parts.Select(e => e.PartNumber));
                    }
                }

                if (partList.Any())
                {
                    partList = partList.DistinctBy(x => x.ContentLink.ID).ToList();
                }

                var changedParts = new List<PartProduct>();

                foreach (var partProduct in partList)
                {
                    var writeablePart = partProduct.CreateWritableClone<PartProduct>();

                    BindModelPageList(writeablePart, currentPage, partListNeedRemoveModelPageLink.Any(e => e.Equals(partProduct.PartNumber)), marketId, sitesDefinition);

                    changedParts.Add(writeablePart);
                }

                foreach (var changedPart in changedParts)
                {
                    _contentRepository.Save(changedPart, SaveAction.Patch, AccessLevel.NoAccess);
                }
            }
        }


        /// <summary>
        /// Bind model page list for Brands parts
        /// </summary>
        /// <param name="writeablePart"></param>
        /// <param name="page"></param>
        /// <param name="currentMarkets">List of the markets should be added to parts</param>
        /// <param name="sitesDefinition"></param>
        private void BindModelPageList(PartProduct writeablePart, ISparePartCategoryPage page, bool isRemoveModelPageLink,
            string currentMarket, List<SiteDefinitionData> sitesDefinition)
        {
            var parentSegment = page.FriendlyUrl.Split(new[] { "/" }, StringSplitOptions.RemoveEmptyEntries).Last();
            var siteId = page.GetSiteId();
            if (string.IsNullOrWhiteSpace(siteId))
            {

                var site = _siteDefinition.GetByContent(page.ContentLink, false);
                siteId = site.Id.ToString();
            }
            var siteDef = sitesDefinition.FirstOrDefault(x => x.SiteId.ToString().Equals(siteId, StringComparison.InvariantCultureIgnoreCase));
            var siteUrl = siteDef != null ? siteDef.SiteUrl : EPiServer.Web.SiteDefinition.Current.SiteUrl.ToString();

            var pageUrl = page.FriendlyUrl;
            pageUrl = pageUrl.StartsWith("https://") ? pageUrl : $"{siteUrl.TrimEnd('/')}{pageUrl}";


            if (writeablePart.ModelPageList == null)
            {
                writeablePart.ModelPageList = new List<ModelPartPageLink>();
            }
            var modelPage = writeablePart.ModelPageList.FirstOrDefault(x => x.PageId == page.ContentLink.ID &&
                                                                            x.MarketId.Equals(currentMarket, StringComparison.InvariantCultureIgnoreCase));

            if (modelPage != null)
            {
                writeablePart.ModelPageList.Remove(modelPage);
            }

            if (!isRemoveModelPageLink)
            {
                writeablePart.ModelPageList.Add(new ModelPartPageLink
                {
                    MarketId = currentMarket,
                    Key = parentSegment,
                    //ModelCategoryCode = MISSING model category code with page. Band site does not have direct link to model category
                    ModelCategoryName = page.Name,
                    Url = pageUrl,
                    PageId = page.ContentLink.ID,
                    VisibleInMenu = page.VisibleInMenu
                });
            }
        }

        private int StandardizationPartName(ContentReference partRootContentReference, List<BrandMarketMapping> marketBrandMapping, CultureInfo language, int tempPartsCategoryId)
        {
            var categories = _contentLoader.GetChildren<PartCategory>(partRootContentReference, language).Where(x => x.ContentLink.ID != tempPartsCategoryId).ToList();

            Logger.Error($"SparePartIndexingService::ReconsignContent INFO start updating Model Link Of Part With Pnc And Model.");
            var updatedParts = new List<string>();
            var ignoredParts = new List<string>();
            var totalParts = 0;
            var maxItemsPerBatch = 500;

            foreach (var category in categories)
            {
                var pointer = 0;
                var canDo = true;

                Logger.Error($"SparePartIndexingService::StandardizationPartName reconciling for category:{category.DisplayName}-{category.ContentLink.ID}");

                while (canDo)
                {
                    var partContents = GetEntriesRecursive<PartProduct>(category.ContentLink, language).Skip(pointer * maxItemsPerBatch).Take(maxItemsPerBatch).ToList();
                    canDo = partContents.Count == maxItemsPerBatch;
                    pointer++;
                    totalParts += partContents.Count;

                    foreach (var part in partContents)
                    {
                        var partName = part.Name.FirstCharToUpper();
                        var partDisplayName = part.DisplayName.FirstCharToUpper();
                        var partKey = $"{part.PartNumber}-{part.ContentLink.ID}";

                        if (partName.Equals(part.Name, StringComparison.InvariantCulture) && partDisplayName.Equals(part.DisplayName, StringComparison.InvariantCulture))
                        {
                            ignoredParts.Add(partKey);
                            continue;
                        }

                        try
                        {
                            var writeablePart = part.CreateWritableClone<PartProduct>();

                            writeablePart.Name = partName;
                            writeablePart.DisplayName = partDisplayName;
                            _contentRepository.Save(writeablePart, SaveAction.Patch, AccessLevel.NoAccess);
                            updatedParts.Add(partKey);
                        }
                        catch (Exception e)
                        {
                            Logger.Error($"StandardizationPartName:: ERROR Updating Part has error: {partKey}", e);
                        }
                    }
                }
            }


            Logger.Error($"StandardizationPartName:: INFO Updated {updatedParts.Count}/{totalParts} Parts:\r\n{string.Join("\r\n", updatedParts)}");
            Logger.Error($"StandardizationPartName:: INFO Ignored {ignoredParts.Count} Parts:\r\n{string.Join("\r\n", ignoredParts)}");

            return updatedParts.Count;
        }

        private void UpdateAssociationsOfPnc(ISparePartCategoryPage[] catPages,
            List<BrandMarketMapping> marketBrandMapping, List<CatalogWork> metaFields, CultureInfo language)
        {
            var counter = 0;
            var contentAreas = catPages.Where(x =>
                x.NewCategoryCollection != null && x.NewCategoryCollection.Items != null &&
                x.NewCategoryCollection.FilteredItems.Any()).Select(x => x.NewCategoryCollection.FilteredItems);
            var modelCategoryLinks = new List<ContentReference>();
            var processedPncList = new List<int>();
            contentAreas.ForEach(x =>
            {
                modelCategoryLinks.AddRange(x.Select(p => p.ContentLink));
            });

            foreach (var contentLink in modelCategoryLinks)
            {
                if (_contentLoader.TryGet<ModelCategory>(contentLink, out var modelCategory))
                {
                    var subNodes = _contentLoader.GetChildren<ModelCategory>(modelCategory.ContentLink, modelCategory.Language).ToArray();
                    if (subNodes.Any())
                    {
                        counter += DoUpdateBrandListForPncBySql(subNodes, marketBrandMapping, metaFields, language.Name, processedPncList);
                    }
                    else
                    {
                        counter += DoUpdateBrandListForPncBySql(new[] { modelCategory }, marketBrandMapping, metaFields, language.Name, processedPncList);
                    }
                }
            }

            Logger.Error($"UpdateAssociationsOfPnc: INFO There are {counter} PNCs has been updated");
        }

        private int DoUpdateBrandListForPncBySql(ModelCategory[] subNodes, List<BrandMarketMapping> marketBrandMapping,
            List<CatalogWork> metaFields, string language, List<int> processedPncList)
        {
            var contentCache = ServiceLocator.Current.GetInstance<IContentCacheHandler>();
            contentCache.Clear();

            int updatedItems = 0;
            var modelListMetaField = metaFields.FirstOrDefault(x =>
                x.MetaFieldName.Equals("ModelsList", StringComparison.InvariantCultureIgnoreCase));
            if (modelListMetaField == null)
            {
                Logger.Error($"SparePartIndexingService::DoUpdateBrandListForPncBySql INFO: ModelsList meta field not found in database!");

                return 0;
            }

            foreach (var node in subNodes)
            {
                var maxItemsPerBatch = 500;
                var pointer = 0;
                var canDo = true;
                while (canDo)
                {
                    var allPncs = GetEntriesRecursive<PncProduct>(node.ContentLink, node.Language)
                        .Skip(pointer * maxItemsPerBatch).Take(maxItemsPerBatch).ToList();
                    canDo = allPncs.Count == maxItemsPerBatch;
                    pointer++;

                    allPncs = allPncs.Where(x => !processedPncList.Contains(x.ContentLink.ID)).ToList();

                    var pncIds = allPncs.Select(x => x.ContentLink.ID).ToArray();

                    if (pncIds.Length == 0)
                    {
                        continue;
                    }

                    var pncWorkVersions = GetCatalogLatestVersion(pncIds);

                    //Delete a previous values
                    var sql = $"DELETE FROM ecfVersionProperty WHERE MetaFieldId = {modelListMetaField.MetaFieldId} AND ObjectId IN ({string.Join(",", pncIds)})";
                    var d = SqlHelper.Instance.DeleteQuery(sql);
                    Logger.Error($"SparePartIndexingService::DoUpdateBrandListForPncBySql INFO run delete ecfVersionProperty on {pncIds.Length} PNCs. Effected {d} items");

                    sql = $"DELETE FROM CatalogContentProperty WHERE MetaFieldId = {modelListMetaField.MetaFieldId} AND ObjectId IN ({string.Join(",", pncIds)})";
                    d = SqlHelper.Instance.DeleteQuery(sql);
                    Logger.Error($"SparePartIndexingService::DoUpdateBrandListForPncBySql INFO run delete CatalogContentProperty on {pncIds.Length} PNCs. Effected {d} items");

                    var sbSql = new StringBuilder();
                    foreach (var pnc in allPncs)
                    {
                        try
                        {
                            processedPncList.Add(pnc.ContentLink.ID);

                            var modelLinks = pnc.GetParentProducts().ToList();
                            var models = _contentLoader.GetItems(modelLinks, pnc.Language).OfType<ModelProduct>();
                            var modelBrands = new List<RelatedProductLink>();
                            foreach (var model in models)
                            {
                                var modelMarkets = marketBrandMapping.Where(x =>
                                    x.BrandCode.Equals(model.Brand, StringComparison.InvariantCultureIgnoreCase));
                                modelBrands.AddRange(modelMarkets.Select(x => new RelatedProductLink
                                {
                                    Name = Sanitizing(model.DisplayName),
                                    Code = model.ModelNumber,
                                    Brand = model.Brand,
                                    MarketId = x.MarketId,
                                    EntryId = model.ContentLink.ID,
                                    IsVirtual = model.IsVirtualModel
                                }).ToList());
                            }

                            if (modelBrands.Count == 0)
                            {
                                Logger.Error($"DoUpdateBrandListForPncBySql:: WARN skipped the PNC {pnc.PNC}-{pnc.ContentLink.ID}");
                                continue;
                            }

                            var pncWork = pncWorkVersions.First(x => x.ObjectId == pnc.ContentLink.ID);
                            var jsonData = JsonConvert.SerializeObject(modelBrands);

                            sbSql.AppendLine(
                                $"INSERT INTO ecfVersionProperty ([WorkId], [ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                                $"VALUES ({pncWork.WorkId}, {pncWork.ObjectId}, 0, {modelListMetaField.MetaFieldId}, {modelListMetaField.MetaClassId}, N'{modelListMetaField.MetaFieldName}', N'{language}', N'{jsonData}',1);");

                            sbSql.AppendLine(
                                $"INSERT INTO CatalogContentProperty ([ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                                $"VALUES ({pncWork.ObjectId}, 0, {modelListMetaField.MetaFieldId}, {modelListMetaField.MetaClassId}, N'{modelListMetaField.MetaFieldName}', N'{language}', N'{jsonData}',1);");
                            updatedItems++;

                        }
                        catch (Exception e)
                        {
                            Logger.Error($"SparePartIndexingService::UpdateAssociationsOfPnc ERROR has an exception when reconciling PNC {pnc.PNC}. There are {updatedItems} PNCs been processed!", e);
                        }
                    }

                    //Start saving:
                    d = SqlHelper.Instance.InsertQuery(sbSql.ToString(), timeOut: 500);
                    if (d > 0)
                    {
                        Logger.Error($"SparePartIndexingService::DoUpdateBrandListForPncBySql INFO: Saved {d}/{updatedItems} ModelsList for {pncIds.Length} from CatalogContentProperty!");
                    }
                }
            }

            return updatedItems;
        }

        private string Sanitizing(string value)
        {
            return value.Replace("'", "''").Replace("@", "").Replace("#", "").Replace("%", "");
        }

        private List<ModelPageCategories> GetModelCategoriesFromModelPages(ISparePartCategoryPage[] pages)
        {
            var list = new List<ModelPageCategories>();
            var brandMarketMappings = SiteSettings.Instance.GetBrandMarketMapping().ToArray();

            foreach (var page in pages.Where(x => x.NewCategoryCollection != null && x.NewCategoryCollection.Items != null &&
                                                 x.NewCategoryCollection.FilteredItems.Any()))
            {
                var listItem = new ModelPageCategories();
                listItem.Page = page;
                if (TryGetSiteUrlFromPage(page, out string siteUrl))
                {
                    listItem.SiteUrl = siteUrl;
                    var site = brandMarketMappings.FirstOrDefault(x => siteUrl.ToLower().Contains(x.Dns.ToLower()));
                    listItem.MarketId = site == null ? "" : site.MarketId;
                }

                foreach (var areaItem in page.NewCategoryCollection.Items)
                {

                    if (_contentLoader.TryGet<ModelCategory>(areaItem.ContentLink, out var modelCategory))
                    {
                        listItem.Categories.Add(new ModelCategoryBriefViewModel
                        {
                            ContentLink = modelCategory.ContentLink,
                            Code = modelCategory.Code,
                            MarketId = listItem.MarketId
                        });

                        var subNodes = _contentLoader.GetChildren<ModelCategory>(modelCategory.ContentLink, modelCategory.Language);
                        if (subNodes.Any())
                        {
                            listItem.Categories.AddRange(subNodes.Select(x => new ModelCategoryBriefViewModel
                            {
                                ContentLink = x.ContentLink,
                                Code = x.Code,
                                MarketId = listItem.MarketId
                            }));
                        }
                    }
                }

                if (listItem.Categories.Any())
                {
                    list.Add(listItem);
                }
            }

            return list;
        }

        private void RemoveAssociationsOfPartBySql(ContentReference partRootContentRef, CultureInfo language, int tempPartCategoryId, out int[] patCategoryIds)
        {
            var watcher = new Stopwatch();
            watcher.Start();

            var contentCache = ServiceLocator.Current.GetInstance<IContentCacheHandler>();
            contentCache.Clear();

            Logger.Error($"SparePartIndexingService::RemoveAssociationsOfPartBySql INFO reconciling content. Removing existing associations of parts");
            var counter = 0;
            var nParts = 0;
            var maxItems = 500;

            var partCategories = GetNodesRecursive<PartCategory>(partRootContentRef, language)
                .Where(x => x.ContentLink.ID != tempPartCategoryId).ToList();

            patCategoryIds = partCategories.Select(x => x.ContentLink.ID).Where(x => x != tempPartCategoryId).ToArray();

            var pointer = 0;
            var canDo = true;

            while (canDo)
            {
                var parts = GetEntriesRecursive<PartProduct>(partRootContentRef, language).Skip(pointer * maxItems).Take(maxItems).ToList();
                canDo = parts.Count == maxItems;
                pointer++;
                nParts += parts.Count;

                var partIds = parts.Select(x => x.ContentLink.ID).ToList();
                var joinedPartIds = string.Join(",", partIds);

                if (!UpdatePageLinkOnly)
                {
                    DeletePartAssociations(joinedPartIds, partIds);
                }

                DeletePartLinksList(joinedPartIds, partIds);
            }

            watcher.Stop();
            Logger.Error($"SparePartIndexingService::RemoveAssociationsOfPartBySql INFO reconciling content. Removed associations of {counter}/{nParts} parts took {watcher.Elapsed.TotalMinutes} minutes");
        }

        /// <summary>
        /// Delete ModelNumberListLinks, PncNumberListLinks, ModelPageList, BrandsList from Parts
        /// </summary>
        /// <param name="joinedPartIds"></param>
        /// <param name="partIds"></param>
        private void DeletePartLinksList(string joinedPartIds, List<int> partIds)
        {
            #region Delete ModelNumberListLinks, PncNumberListLinks, ModelPageList, BrandsList

            var linkListSql = $"DELETE ecfVersionProperty FROM ecfVersionProperty INNER JOIN ecfVersion ON ecfVersion.WorkId = ecfVersionProperty.WorkId " +
                $"WHERE ecfVersion.ObjectId IN ({joinedPartIds}) AND ecfVersion.Status = 4 AND " +
                $"(ecfVersionProperty.MetaFieldName = 'ModelNumberListLinks' OR ecfVersionProperty.MetaFieldName = 'PncNumberListLinks' OR ecfVersionProperty.MetaFieldName = 'ModelPageList' OR ecfVersionProperty.MetaFieldName = 'BrandsList')";

            if (UpdatePageLinkOnly)
            {
                linkListSql = $"DELETE ecfVersionProperty FROM ecfVersionProperty INNER JOIN ecfVersion ON ecfVersion.WorkId = ecfVersionProperty.WorkId " +
                              $"WHERE ecfVersion.ObjectId IN ({joinedPartIds}) AND ecfVersion.Status = 4 AND " +
                              $"ecfVersionProperty.MetaFieldName = 'ModelPageList'";

            }

            var d1 = SqlHelper.Instance.DeleteQuery(linkListSql);
            Logger.Error($"SparePartIndexingService::DeletePartLinksList INFO run delete ecfVersionProperty on {partIds.Count} parts. Effected {d1} items");

            linkListSql =
                $"DELETE FROM CatalogContentProperty WHERE ObjectId IN ({joinedPartIds}) AND " +
                $"(MetaFieldName = 'ModelNumberListLinks' OR MetaFieldName = 'PncNumberListLinks' OR MetaFieldName = 'ModelPageList' OR MetaFieldName = 'BrandsList')";

            if (UpdatePageLinkOnly)
            {
                linkListSql = $"DELETE FROM CatalogContentProperty WHERE ObjectId IN ({joinedPartIds}) AND MetaFieldName = 'ModelPageList'";
            }
            d1 = SqlHelper.Instance.DeleteQuery(linkListSql);

            Logger.Error($"SparePartIndexingService::DeletePartLinksList INFO run delete CatalogContentProperty on {partIds.Count} parts. Effected {d1} items");

            #endregion
        }

        private void DeletePartAssociations(string joinedPartIds, List<int> partIds)
        {
            int d1;

            #region Delete Associations or Parts

            var ceaSql =
                $"DELETE CatalogEntryAssociation FROM CatalogEntryAssociation INNER JOIN CatalogAssociation ON CatalogEntryAssociation.CatalogAssociationId = CatalogAssociation.CatalogAssociationId " +
                $"WHERE CatalogAssociation.CatalogEntryId IN ({joinedPartIds})";

            d1 = SqlHelper.Instance.DeleteQuery(ceaSql);

            Logger.Error($"SparePartIndexingService::RemoveAssociationsOfPartBySql INFO run delete CatalogEntryAssociation on {partIds.Count} parts. Effected {d1} items");

            var caSql = $"DELETE FROM CatalogAssociation WHERE CatalogEntryId IN ({joinedPartIds})";
            d1 = SqlHelper.Instance.DeleteQuery(caSql);
            Logger.Error($"SparePartIndexingService::RemoveAssociationsOfPartBySql INFO run delete CatalogAssociation on {partIds.Count} parts. Effected {d1} items");

            #endregion
        }

        private void RemoveAssociationsOfPartCategoryBySql(int[] patCategoryIds)
        {
            var watcher = new Stopwatch();
            watcher.Start();
            var joinedIds = string.Join(",", patCategoryIds.Select(x => x & 1073741823));

            var linkListSql = $"DELETE ecfVersionProperty FROM ecfVersionProperty INNER JOIN ecfVersion ON ecfVersion.WorkId = ecfVersionProperty.WorkId " +
                              $"WHERE ecfVersion.ObjectId IN ({joinedIds}) AND ecfVersion.Status = 4 AND ecfVersionProperty.MetaFieldName = 'ModelPartPageList'";
            var d1 = SqlHelper.Instance.DeleteQuery(linkListSql);
            Logger.Error($"SparePartIndexingService::RemoveAssociationsOfPartCategoryBySql INFO run delete ecfVersionProperty on {patCategoryIds.Length} part's categories. Effected {d1} items");


            linkListSql = $"DELETE FROM CatalogContentProperty WHERE ObjectId IN ({joinedIds}) AND MetaFieldName = 'ModelPartPageList'";
            d1 = SqlHelper.Instance.DeleteQuery(linkListSql);
            Logger.Error($"SparePartIndexingService::RemoveAssociationsOfPartCategoryBySql INFO run delete CatalogContentProperty on {patCategoryIds.Length} part's categories. Effected {d1} items");

            watcher.Stop();
            Logger.Error($"SparePartIndexingService::RemoveAssociationsOfPartCategoryBySql INFO reconciling content. Removed associations of {patCategoryIds.Length} part's categories took {watcher.Elapsed.TotalMinutes} minutes");
        }

        private List<CatalogWork> GetCatalogLatestVersion(int[] entryIds)
        {
            var sql = $"SELECT WorkId, ObjectId FROM ecfVersion WHERE Status = 4 AND ObjectId IN ({string.Join(",", entryIds)})";
            var result = SqlHelper.Instance.SelectQuery<CatalogWork>(sql, reader => new CatalogWork
            {
                WorkId = (int)reader["WorkId"],
                ObjectId = (int)reader["ObjectId"]
            });

            return result;
        }

        private List<CatalogWork> GetMetaFields()
        {
            var sql = $"SELECT mf.MetaFieldId, mf.Name, mc.MetaClassId FROM MetaField mf " +
                      $"INNER JOIN MetaClassMetaFieldRelation mfr ON mf.MetaFieldId = mfr.MetaFieldId " +
                      $"INNER JOIN MetaClass mc ON mc.MetaClassId = mfr.MetaClassId " +
                      $"WHERE mf.Name = 'ModelNumberListLinks' OR mf.Name = 'PncNumberListLinks' OR mf.Name = 'ModelPageList' OR mf.Name = 'BrandsList' OR mf.Name = 'ModelPartPageList' OR mf.Name = 'ModelsList'";
            var result = SqlHelper.Instance.SelectQuery<CatalogWork>(sql, reader => new CatalogWork
            {
                MetaFieldId = (int)reader["MetaFieldId"],
                MetaFieldName = reader["Name"].ToString(),
                MetaClassId = (int)reader["MetaClassId"]
            });

            return result;
        }

        /// <summary>
        /// Add relationship (association) from part to Models, Pncs, Model Listing Page and Add model listing page into Part Category based on Part
        /// </summary>
        /// <param name="modelContentReference"></param>
        /// <param name="modelCategoryPages"></param>
        /// <param name="marketBrandMapping"></param>
        /// <param name="language"></param>
        /// <param name="tempModelsId"></param>
        /// <param name="metaFields"></param>
        /// <param name="argCallbackNotification"></param>
        private void UpdateAssociationOfPartWithPncAndModelBySql(ContentReference modelContentReference,
            List<ModelPageCategories> modelCategoryPages,
            List<BrandMarketMapping> marketBrandMapping, CultureInfo language, int tempModelsId, int tempPartCategoryId,
            List<CatalogWork> metaFields, Func<string, bool> argCallbackNotification = null)
        {
            var nParts = 0;
            var nPncs = 0;
            var content = _contentLoader.Get<CatalogContentBase>(modelContentReference);
            var processedPnc = new StringBuilder();
            var tempPartList = new List<int>();
            var notFoundModelPageList = new List<string>();
            var updatedPartsList = new List<string>();
            var updatedPncsList = new List<string>();
            var maxItemsPerBatch = 500;
            var pageLinkOfPartCategory = new Dictionary<int, List<ModelPartPageLink>>();
            var pageLinkPart = new Dictionary<int, List<ModelPartPageLink>>();
            var modelLinkPart = new Dictionary<int, List<RelatedProductLink>>();
            var pncLinkPart = new Dictionary<int, List<RelatedProductLink>>();
            var brandLinkPart = new Dictionary<int, List<string>>();
            var contentCache = ServiceLocator.Current.GetInstance<IContentCacheHandler>();
            contentCache.Clear();

            Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql INFO reconciling content. Start updating association for PNC");

            var watcher = new Stopwatch();
            watcher.Start();

            var modelCategories = _contentLoader.GetChildren<ModelCategory>(modelContentReference, language)
                .Where(x => x.ContentLink.ID != tempModelsId).ToList();

            foreach (var category in modelCategories)
            {

                var pointer = 0;
                var canDo = true;
                var index = 0;
                InvokeNotification(argCallbackNotification, $"Updating Associations and PNC/Model/Model Page links of Part in the category: {category.DisplayName}-{category.ContentLink.ID}");
                while (canDo)
                {
                    Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql INFO reconciling for model category: {category.DisplayName}-{category.ContentLink.ID}");
                    contentCache.Clear();
                    var pncBatch = GetEntriesRecursive<PncProduct>(category.ContentLink, content.Language).Skip(pointer * maxItemsPerBatch).Take(maxItemsPerBatch).ToList();
                    canDo = pncBatch.Count == maxItemsPerBatch;
                    pointer++;

                    foreach (var pnc in pncBatch)
                    {
                        var pncKey = $"{pnc.PNC}-{pnc.ContentLink.ID}";

                        try
                        {
                            if (updatedPncsList.Contains(pncKey))
                            {
                                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql WARN skipped the PNC {pncKey} cause processed.");
                                InvokeNotification(argCallbackNotification, $"UpdateAssociationOfPartWithPncAndModelBySql WARN skipped the PNC {pncKey} cause processed.");
                                continue;
                            }

                            updatedPncsList.Add(pncKey);

                            if (pnc.ModelsList == null || !pnc.ModelsList.Any())
                            {
                                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql WARN reconciling content. The PNC {pncKey} does not have parent model list.");
                                InvokeNotification(argCallbackNotification, $"UpdateAssociationOfPartWithPncAndModelBySql WARN reconciling content. The PNC {pncKey} does not have parent model list.");
                                continue;
                            }

                            var pncCategory = pnc.GetCategories().First();
                            var marketsFromModel = marketBrandMapping
                                .Where(x => pnc.ModelsList.Any(p =>
                                    p.Brand.Equals(x.BrandCode, StringComparison.InvariantCultureIgnoreCase)))
                                .Select(x => x.MarketId).Distinct().ToList();

                            var modelPages = modelCategoryPages.Where(x => x.Categories.Any(p => p.ContentLink.Equals(pncCategory)) && marketsFromModel.Contains(x.MarketId) && x.Page != null);

                            if (notFoundModelPageList.Any(x => x == pncKey))
                            {
                                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql WARN reconciling content. Cannot found the page/model category for the PNC {pncKey}");
                                InvokeNotification(argCallbackNotification, $"UpdateAssociationOfPartWithPncAndModelBySql WARN reconciling content. Cannot found the page/model category for the PNC {pncKey}");
                                continue;
                            }

                            if (!modelPages.Any())
                            {
                                notFoundModelPageList.Add(pncKey);
                                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql WARN reconciling content. Cannot found the page/model category for the PNC {pncKey}");
                                InvokeNotification(argCallbackNotification, $"UpdateAssociationOfPartWithPncAndModelBySql WARN reconciling content. Cannot found the page/model category for the PNC {pncKey}");
                                continue;
                            }

                            nPncs++;
                            processedPnc.AppendLine(pncKey);
                            if (nPncs % 100 == 0)
                            {
                                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql INFO reconciling content. Updating association for PNCs with index: {nPncs} Processed items: \r\n{processedPnc}");
                                InvokeNotification(argCallbackNotification, $"UpdateAssociationOfPartWithPncAndModelBySql INFO reconciling content. Updating association for PNCs with index: {nPncs} ");
                                processedPnc.Clear();
                            }

                            //var modelPagesOfPnc = new List<ModelPageCategories>();
                            var modelPagesOfPnc = modelPages.Select(x => new ModelPageCategories
                            {
                                Page = x.Page.CreateWritableClone() as ProductModelCategoryPage,
                                MarketId = x.MarketId,
                                SiteUrl = x.SiteUrl,
                                Categories = new List<ModelCategoryBriefViewModel>() { x.Categories.First() }
                            }).ToList();

                            index++;

                            try
                            {
                                nParts += BuildUpdateAssociationForListPartsInPncSql(pnc, tempPartList, modelPagesOfPnc, updatedPartsList, pageLinkOfPartCategory,
                                    pageLinkPart, modelLinkPart, pncLinkPart, brandLinkPart, tempPartCategoryId);
                            }
                            catch (Exception e)
                            {
                                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql ERROR reconciling content for list of part of the PNC {pncKey}. Switched to reconciling for individual part.", e);
                                InvokeNotification(argCallbackNotification, $"UpdateAssociationOfPartWithPncAndModelBySql ERROR reconciling content for list of part of the PNC {pncKey}. Switched to reconciling for individual part.");
                                nParts += BuildUpdateAssociationForListPartsInPncSql(pnc, tempPartList, modelPagesOfPnc, updatedPartsList, pageLinkOfPartCategory,
                                    pageLinkPart, modelLinkPart, pncLinkPart, brandLinkPart, tempPartCategoryId);
                            }
                        }
                        catch (Exception e)
                        {
                            Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql ERROR has an exception when reconciling PNC {pncKey}. There are {nPncs - 1} PNCs been processed!", e);
                            InvokeNotification(argCallbackNotification, $"UpdateAssociationOfPartWithPncAndModelBySql ERROR has an exception when reconciling PNC {pncKey}. There are {nPncs - 1} PNCs been processed!");
                        }
                    }
                }

                System.GC.Collect();
            }


            if (processedPnc.Length > 0)
            {
                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql INFO reconciling content. Updating association for LAST batch PNCs with index: {nPncs}\r\n{processedPnc}");
                InvokeNotification(argCallbackNotification, $"UpdateAssociationOfPartWithPncAndModelBySql INFO reconciling content. Updating association for LAST batch PNCs with index: {nPncs}");
                processedPnc.Clear();
            }

            if (notFoundModelPageList.Count > 0)
            {
                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql WARN reconciling content. List of PNCs not found model page: \r\n{string.Join("\r\n", notFoundModelPageList)}");
                InvokeNotification(argCallbackNotification, $"UpdateAssociationOfPartWithPncAndModelBySql WARN reconciling content. {notFoundModelPageList.Count} PNCs not found model page. Check log for details.");
            }


            if (pageLinkOfPartCategory.Count != 0)
            {
                InvokeNotification(argCallbackNotification, $"InsertPartAndPartCategoryLinksList INFO Start updating for {pageLinkPart.Count} model pages of Part and {pageLinkOfPartCategory.Count} model pages of Part Category");

                var partWorks = InsertPartAndPartCategoryLinksList(language, metaFields, pageLinkOfPartCategory, pageLinkPart, out var updatedPartCategories, out var updatedParts);

                InvokeNotification(argCallbackNotification, $"UpdateModelLinkOfPartWithPncAndModel INFO Start updating for {modelLinkPart.Count} model links, {pncLinkPart.Count} pnc links and {brandLinkPart.Count} brand links of Part");

                UpdateModelLinkOfPartWithPncAndModel(partWorks, modelLinkPart, pncLinkPart, brandLinkPart, metaFields, language.Name);

                watcher.Stop();
                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql INFO reconciling content. There were {nPncs} PNCs linked to Parts, " +
                             $"Ignored {tempPartList.Count} Temp Parts, Updated {updatedParts}/{pageLinkPart.Count} Parts in total {nParts} Part's, Updated {updatedPartCategories}/{pageLinkOfPartCategory.Count} Categories." +
                             $"\r\n The Process Took {watcher.Elapsed.TotalMinutes} minutes.");
            }
            else
            {
                watcher.Stop();
                Logger.Error($"SparePartIndexingService::UpdateAssociationOfPartWithPncAndModelBySql ERROR reconciling content. There were {nPncs} PNCs linked to Parts, " +
                             $"BUT page Link Of Part Category is empty so model page link of part categories would be empty." + $"\r\n The Process Took {watcher.Elapsed.TotalMinutes} minutes.");
            }


        }

        private List<CatalogWork> InsertPartAndPartCategoryLinksList(CultureInfo language, List<CatalogWork> metaFields,
            Dictionary<int, List<ModelPartPageLink>> pageLinkOfPartCategory, Dictionary<int, List<ModelPartPageLink>> pageLinkPart, out int updatedPartCartegories, out int updatedParts)
        {
            //Insert Data
            var partCategoryIds = pageLinkOfPartCategory.Keys.Select(x => x & 1073741823).ToArray();
            var partCategoryWorks = GetCatalogLatestVersion(partCategoryIds);

            var partIds = pageLinkPart.Keys.Select(x => x).ToArray();
            var partWorks = GetCatalogLatestVersion(partIds);

            var partCatSb = new StringBuilder();
            var partSb = new StringBuilder();
            var modelPageMetaFieldOfPart = metaFields.First(x => x.MetaFieldName.Equals(Constant.PartMetaFields.ModelPageList, StringComparison.InvariantCultureIgnoreCase));
            var modelPageMetaFieldOfPartCategory = metaFields.First(x => x.MetaFieldName.Equals(Constant.PartCategoryMetaFields.ModelPartPageList, StringComparison.InvariantCultureIgnoreCase));
            var index = 0;
            updatedPartCartegories = 0;
            updatedParts = 0;

            foreach (var kv in pageLinkOfPartCategory)
            {
                var partCatWork = partCategoryWorks.FirstOrDefault(x => x.ObjectId == (kv.Key & 1073741823));
                if (partCatWork == null)
                {
                    Logger.Error($"InsertPartAndPartCategoryLinksList:: WARN Part Category Id:{kv.Key} has been skipped cause of not found work version.");
                    continue;
                }

                index++;

                var jsonData = Sanitizing(JsonConvert.SerializeObject(kv.Value));

                partCatSb.AppendLine(
                    $"INSERT INTO ecfVersionProperty ([WorkId], [ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                    $"VALUES ({partCatWork.WorkId}, {partCatWork.ObjectId}, 0, {modelPageMetaFieldOfPartCategory.MetaFieldId}, {modelPageMetaFieldOfPartCategory.MetaClassId}, N'{modelPageMetaFieldOfPartCategory.MetaFieldName}', N'{language.Name}', N'{jsonData}',1);");

                partCatSb.AppendLine(
                    $"INSERT INTO CatalogContentProperty ([ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                    $"VALUES ({partCatWork.ObjectId}, 1, {modelPageMetaFieldOfPartCategory.MetaFieldId}, {modelPageMetaFieldOfPartCategory.MetaClassId}, N'{modelPageMetaFieldOfPartCategory.MetaFieldName}', N'{language.Name}', N'{jsonData}',1);");

                if (index > 199)
                {
                    var d = SqlHelper.Instance.InsertQuery(partCatSb.ToString(), timeOut: 500);
                    updatedPartCartegories += d;
                    Logger.Error($"InsertPartAndPartCategoryLinksList:: INFO Inserted {d}/{index} Page Links Of Part Category");
                    partCatSb.Clear();
                    index = 0;
                }
            }

            if (index > 0)
            {
                var d = SqlHelper.Instance.InsertQuery(partCatSb.ToString(), timeOut: 500);
                updatedPartCartegories += d;
                Logger.Error($"InsertPartAndPartCategoryLinksList:: INFO Inserted {d}/{index} Page Links Of Part Category");
                partCatSb.Clear();
            }

            index = 0;
            foreach (var kv in pageLinkPart)
            {
                var partWork = partWorks.FirstOrDefault(x => x.ObjectId == kv.Key);
                if (partWork == null)
                {
                    Logger.Error($"InsertPartAndPartCategoryLinksList:: WARN Part Id:{kv.Key} has been skipped cause of not found work version.");
                    continue;
                }

                index++;

                var jsonData = Sanitizing(JsonConvert.SerializeObject(kv.Value));

                partSb.AppendLine(
                    $"INSERT INTO ecfVersionProperty ([WorkId], [ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                    $"VALUES ({partWork.WorkId}, {partWork.ObjectId}, 0, {modelPageMetaFieldOfPart.MetaFieldId}, {modelPageMetaFieldOfPart.MetaClassId}, N'{modelPageMetaFieldOfPart.MetaFieldName}', N'{language.Name}', N'{jsonData}',1);");

                partSb.AppendLine(
                    $"INSERT INTO CatalogContentProperty ([ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                    $"VALUES ({partWork.ObjectId}, 0, {modelPageMetaFieldOfPart.MetaFieldId}, {modelPageMetaFieldOfPart.MetaClassId}, N'{modelPageMetaFieldOfPart.MetaFieldName}', N'{language.Name}', N'{jsonData}',1);");

                if (index > 199)
                {
                    var d = SqlHelper.Instance.InsertQuery(partSb.ToString(), timeOut: 500);
                    updatedParts += d;
                    Logger.Error($"InsertPartAndPartCategoryLinksList:: INFO Inserted {d}/{index} Page Link Part");
                    partSb.Clear();
                    index = 0;
                }
            }

            if (index > 0)
            {
                var d = SqlHelper.Instance.InsertQuery(partSb.ToString(), timeOut: 500);
                updatedParts += d;
                Logger.Error($"InsertPartAndPartCategoryLinksList:: INFO Inserted {d}/{index} Page Link Part");
                partSb.Clear();
            }
            return partWorks;
        }

        private int BuildUpdateAssociationForListPartsInPncSql(PncProduct pnc, List<int> tempPartList,
            List<ModelPageCategories> modelPagesOfPnc, List<string> updatedPartsList,
            Dictionary<int, List<ModelPartPageLink>> pageLinkOfPartCategory, Dictionary<int, List<ModelPartPageLink>> pageLinkPart,
            Dictionary<int, List<RelatedProductLink>> modelNumberListLinks, Dictionary<int, List<RelatedProductLink>> pncNumberListLinks,
            Dictionary<int, List<string>> brandList, int tempPartCategoryId)
        {
            var nParts = 0;
            var pncAssociations = pnc.GetAssociations().Select(x => x.Target).ToList();
            var parts = _contentLoader.GetItems(pncAssociations, pnc.Language).OfType<PartProduct>().ToList();

            //var insertAssociationParts = new StringBuilder();

            foreach (var part in parts)
            {
                if (!pnc.IsVirtual)
                {
                    if (tempPartList.Any(x => x == part.ContentLink.ID))
                    {
                        continue;
                    }

                    var partCategories = part.DisplayableCategories().ToList();
                    if (partCategories.All(x => x.ContentLink.ID == tempPartCategoryId))
                    {
                        //Skip part belongs to TempParts only
                        tempPartList.Add(part.ContentLink.ID);
                        continue;
                    }
                }

                //Skip part belongs to TempParts only
                var partKey = $"{part.PartNumber}#{part.ContentLink.ID}";
                if (!updatedPartsList.Any(x => x.Equals(partKey)))
                {
                    updatedPartsList.Add(partKey);
                }

                if (UpdatePageLinkOnly)
                {
                    nParts++;
                    CreateModelPageLinkForPart(part, modelPagesOfPnc, pageLinkOfPartCategory, pageLinkPart);
                }
                else
                {
                    nParts++;

                    BuildRelatedLinksForPart(pnc, modelNumberListLinks, pncNumberListLinks, brandList, part);

                    CreateModelPageLinkForPart(part, modelPagesOfPnc, pageLinkOfPartCategory, pageLinkPart);
                }
            }

            return nParts;
        }

        /// <summary>
        /// Build Model List Links, PNC List Links and Brands List for Part
        /// </summary>
        /// <param name="pnc"></param>
        /// <param name="modelNumberListLinks"></param>
        /// <param name="pncNumberListLinks"></param>
        /// <param name="brandList"></param>
        /// <param name="part"></param>
        private void BuildRelatedLinksForPart(PncProduct pnc, Dictionary<int, List<RelatedProductLink>> modelNumberListLinks,
            Dictionary<int, List<RelatedProductLink>> pncNumberListLinks,
            Dictionary<int, List<string>> brandList, PartProduct part)
        {
            #region For Pnc List Links
            var lst = new List<RelatedProductLink>();
            if (pncNumberListLinks.ContainsKey(part.ContentLink.ID))
            {
                lst = pncNumberListLinks[part.ContentLink.ID];
            }
            else
            {
                pncNumberListLinks.Add(part.ContentLink.ID, lst);
            }

            if (lst.All(x => x.EntryId != pnc.ContentLink.ID) && pnc.ModelsList != null)
            {
                lst.AddRange(pnc.ModelsList.Select(x => new RelatedProductLink
                {
                    EntryId = pnc.ContentLink.ID,
                    Code = pnc.PNC,
                    Name = Sanitizing(pnc.DisplayName),
                    IsVirtual = pnc.IsVirtual,
                    MarketId = x.MarketId,
                    Brand = x.Brand
                }).ToList());
            }
            #endregion

            #region For Model List Links
            lst = new List<RelatedProductLink>();
            if (modelNumberListLinks.ContainsKey(part.ContentLink.ID))
            {
                lst = modelNumberListLinks[part.ContentLink.ID];
            }
            else
            {
                modelNumberListLinks.Add(part.ContentLink.ID, lst);
            }

            if (pnc.ModelsList != null && lst.All(x => x.EntryId != pnc.ModelsList.First().EntryId))
            {
                lst.AddRange(pnc.ModelsList.Select(x => new RelatedProductLink
                {
                    EntryId = x.EntryId,
                    Code = x.Code,
                    Name = Sanitizing(x.Name),
                    IsVirtual = x.IsVirtual,
                    MarketId = x.MarketId,
                    Brand = x.Brand
                }).ToList());
            }
            #endregion

            var brands = new List<string>();
            if (brandList.ContainsKey(part.ContentLink.ID))
            {
                brands = brandList[part.ContentLink.ID];
            }
            else
            {
                brandList.Add(part.ContentLink.ID, brands);
            }

            pnc.ModelsList?.ForEach(link =>
            {
                if (!brands.Any(x => x.Equals(link.Brand, StringComparison.InvariantCultureIgnoreCase)))
                {
                    brands.Add(link.Brand);
                }
            });
        }

        private void UpdateModelLinkOfPartWithPncAndModel(List<CatalogWork> partWorks,
            Dictionary<int, List<RelatedProductLink>> modelNumberListLinks,
            Dictionary<int, List<RelatedProductLink>> pncNumberListLinks,
            Dictionary<int, List<string>> brandList, List<CatalogWork> metaFields, string language)
        {
            var brandMetaField = metaFields.First(x => x.MetaFieldName.Equals(Constant.PartMetaFields.BrandsList, StringComparison.InvariantCultureIgnoreCase));
            var modelMetaField = metaFields.First(x => x.MetaFieldName.Equals(Constant.PartMetaFields.ModelNumberListLinks, StringComparison.InvariantCultureIgnoreCase));
            var pncMetaField = metaFields.First(x => x.MetaFieldName.Equals(Constant.PartMetaFields.PncNumberListLinks, StringComparison.InvariantCultureIgnoreCase));

            //Insert 500 items per batch
            var sqlSb = new StringBuilder();
            var index = 0;
            foreach (var pWork in partWorks)
            {
                index++;
                var jsonData = "";
                var models = modelNumberListLinks.ContainsKey(pWork.ObjectId) ? modelNumberListLinks[pWork.ObjectId] : null;
                if (models != null)
                {
                    jsonData = JsonConvert.SerializeObject(models);
                    sqlSb.AppendLine(
                        $"INSERT INTO ecfVersionProperty ([WorkId], [ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                        $"VALUES ({pWork.WorkId}, {pWork.ObjectId}, 0, {modelMetaField.MetaFieldId}, {modelMetaField.MetaClassId}, N'{modelMetaField.MetaFieldName}', N'{language}', N'{jsonData}',1);");

                    sqlSb.AppendLine(
                        $"INSERT INTO CatalogContentProperty ([ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                        $"VALUES ({pWork.ObjectId}, 0, {modelMetaField.MetaFieldId}, {modelMetaField.MetaClassId}, N'{modelMetaField.MetaFieldName}', N'{language}', N'{jsonData}',1);");

                }

                var pncs = pncNumberListLinks.ContainsKey(pWork.ObjectId) ? pncNumberListLinks[pWork.ObjectId] : null;
                if (pncs != null)
                {
                    jsonData = JsonConvert.SerializeObject(pncs);
                    sqlSb.AppendLine(
                        $"INSERT INTO ecfVersionProperty ([WorkId], [ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                        $"VALUES ({pWork.WorkId}, {pWork.ObjectId}, 0, {pncMetaField.MetaFieldId}, {pncMetaField.MetaClassId}, N'{pncMetaField.MetaFieldName}', N'{language}', N'{jsonData}',1);");

                    sqlSb.AppendLine(
                        $"INSERT INTO CatalogContentProperty ([ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                        $"VALUES ({pWork.ObjectId}, 0, {pncMetaField.MetaFieldId}, {pncMetaField.MetaClassId}, N'{pncMetaField.MetaFieldName}', N'{language}', N'{jsonData}',1);");

                }

                var brands = brandList.ContainsKey(pWork.ObjectId) ? brandList[pWork.ObjectId] : null;
                if (brands != null)
                {
                    jsonData = JsonConvert.SerializeObject(brands);
                    sqlSb.AppendLine(
                        $"INSERT INTO ecfVersionProperty ([WorkId], [ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                        $"VALUES ({pWork.WorkId}, {pWork.ObjectId}, 0, {brandMetaField.MetaFieldId}, {brandMetaField.MetaClassId}, N'{brandMetaField.MetaFieldName}', N'{language}', N'{jsonData}',1);");

                    sqlSb.AppendLine(
                        $"INSERT INTO CatalogContentProperty ([ObjectId], [ObjectTypeId], [MetaFieldId], [MetaClassId], [MetaFieldName], [LanguageName], [LongString], [CultureSpecific]) " +
                        $"VALUES ({pWork.ObjectId}, 0, {brandMetaField.MetaFieldId}, {brandMetaField.MetaClassId}, N'{brandMetaField.MetaFieldName}', N'{language}', N'{jsonData}',1);");

                }

                if (index > 49)
                {
                    var d = SqlHelper.Instance.InsertQuery(sqlSb.ToString(), timeOut: 500);
                    Logger.Error(d > 0
                        ? $"UpdateModelLinkOfPartWithPncAndModel:: INFO Inserted {d}/{index} items."
                        : $"UpdateModelLinkOfPartWithPncAndModel:: ERROR Cannot inserted {index} items. Query:\r\n{sqlSb.ToString()}");

                    index = 0;
                    sqlSb.Clear();
                }
            }

            if (index > 0)
            {
                var d = SqlHelper.Instance.InsertQuery(sqlSb.ToString(), timeOut: 500);
                Logger.Error(d > 0
                    ? $"UpdateModelLinkOfPartWithPncAndModel:: INFO Inserted {d}/{index} items."
                    : $"UpdateModelLinkOfPartWithPncAndModel:: ERROR Cannot inserted {index} items. Query:\r\n{sqlSb.ToString()}");

                sqlSb.Clear();
            }
        }

        private void CreateModelPageLinkForPart(PartProduct part, List<ModelPageCategories> modelPagesOfPnc, Dictionary<int, List<ModelPartPageLink>> pageLinkOfPartCategory, Dictionary<int, List<ModelPartPageLink>> pageLinkPart)
        {
            ModelPageCategories processingItem = null;
            try
            {
                foreach (var modelPage in modelPagesOfPnc)
                {
                    processingItem = modelPage;

                    var parentSegment = modelPage.Page.FriendlyUrl.Split(new[] { "/" }, StringSplitOptions.RemoveEmptyEntries).Last();

                    #region Add Model Link to Part Category

                    if (modelPage.Categories != null && modelPage.Categories.Any())
                    {
                        var partCategories = part.DisplayableCategories().ToList();
                        foreach (var pCart in partCategories)
                        {


                            var link = new ModelPartPageLink
                            {
                                MarketId = modelPage.MarketId,
                                ModelCategoryCode = modelPage.Categories.First().Code,
                                ModelCategoryName = modelPage.Page.Name,
                                Key = parentSegment,
                                Url = modelPage.Page.FriendlyUrl,
                                PageId = modelPage.Page.ContentLink.ID,
                                VisibleInMenu = modelPage.Page.VisibleInMenu
                            };

                            var pcList = new List<ModelPartPageLink>();

                            if (pageLinkOfPartCategory.ContainsKey(pCart.ContentLink.ID))
                            {
                                pcList = pageLinkOfPartCategory[pCart.ContentLink.ID];

                            }
                            else
                            {
                                pageLinkOfPartCategory.Add(pCart.ContentLink.ID, pcList);
                            }

                            if (!pcList.Any(x => x.PageId == link.PageId && x.MarketId == link.MarketId))
                            {
                                pcList.Add(link);
                            }
                        }
                    }

                    #endregion

                    #region Add Model Page link to Part

                    var linkP = new ModelPartPageLink
                    {
                        MarketId = modelPage.MarketId,
                        ModelCategoryCode = modelPage.Categories != null ? modelPage.Categories.First().Code : "",
                        ModelCategoryName = modelPage.Page.Name,
                        Key = parentSegment,
                        Url = modelPage.Page.FriendlyUrl,
                        PageId = modelPage.Page.ContentLink.ID,
                        VisibleInMenu = modelPage.Page.VisibleInMenu
                    };

                    var pcListP = new List<ModelPartPageLink>();

                    if (pageLinkPart.ContainsKey(part.ContentLink.ID))
                    {
                        pcListP = pageLinkPart[part.ContentLink.ID];

                    }
                    else
                    {
                        pageLinkPart.Add(part.ContentLink.ID, pcListP);
                    }

                    if (!pcListP.Any(x => x.PageId == linkP.PageId && x.MarketId == linkP.MarketId))
                    {
                        pcListP.Add(linkP);
                    }
                    #endregion
                }
            }
            catch (Exception e)
            {
                Logger.Error($"CreateModelPageLinkForPart:: ERROR create links from part: {part.PartNumber}-{part.ContentLink.ID} to {processingItem.Page.Name}-{processingItem.Page.ContentLink.ID}", e);
            }
        }

        private ISparePartCategoryPage[] GetModelCategoryPages(CultureInfo language, ContentReference[] links)
        {
            language = language ?? ContentLanguage.PreferredCulture;
            var allPages = new List<ISparePartCategoryPage>();

            foreach (var pageRef in links)
            {
                try
                {
                    if (_contentLoader.TryGet<ISparePartCategoryPage>(pageRef, language, out var page))
                    {
                        allPages.Add(page);
                    }
                }
                catch (Exception e)
                {
                    //Cannot get content, just log it out
                    Logger.Error($"ERROR: SparePartIndexingService::GetModelCategoryPages Cannot get content of pageRef: {pageRef.ToString()}", e);
                }

            }
            //Cannot use this in case instance of content link is null. An exception would be thrown
            //var allPages = _contentLoader.GetItems(allPageRefs, language).Where(x => x is ProductModelCategoryPage).ToList();

            var validPages = allPages.Where(x => x.NewCategoryCollection != null && x.NewCategoryCollection.FilteredItems != null && x.NewCategoryCollection.FilteredItems.Any()).ToArray();
            return validPages;
        }

        private bool IsSparePartOrBrandSites(string marketId)
        {
            return Constant.Markets.IsSparePartOrStaffAndBrandMarkets(marketId) ||
                   Constant.Markets.IsB2BPartsMarket(marketId);
        }

        #endregion

        #region Private Classes
        public class CatalogWork
        {
            public int WorkId { get; set; }
            public int ObjectId { get; set; }
            public string MetaFieldName { get; set; }
            public int MetaFieldId { get; set; }
            public int MetaClassId { get; set; }
        }

        private class ModelPageCategories
        {
            public ModelPageCategories()
            {
                Categories = new List<ModelCategoryBriefViewModel>();
            }
            public string SiteUrl { get; set; }
            public string MarketId { get; set; }
            public ISparePartCategoryPage Page { get; set; }
            public List<ModelCategoryBriefViewModel> Categories { get; set; }
        }

        private class ModelCategoryBriefViewModel
        {
            public ContentReference ContentLink { get; set; }
            public string Code { get; set; }
            public string MarketId { get; set; }

        }
        #endregion
    }

    #region Public classes using for Indexing Service

    public class SparePartIncrementalReconciliationJobArg
    {
        public string LanguageName { get; set; }
        public int TempPartsCategoryId { get; set; }
        public int TempModelsCategoryId { get; set; }
        public string[] ModelCategoryPages { get; set; }
        public Func<string, bool> CallbackNotification { get; set; }
    }

    public class SparePartIndexingJobArg
    {
        public string RootModelCategoryCode { get; set; }
        public string RootPartCategoryCode { get; set; }
        public string LanguageName { get; set; }
        public int TempPartsCategoryId { get; set; }
        public int TempModelsCategoryId { get; set; }
        public int IndexPageSize { get; set; }
        public int FromStep { get; set; }
        public string[] ModelCategoryPages { get; set; }
        public bool RemovePartAssociation { get; set; }
        public bool RemovePartCategoryAssociation { get; set; }
        public bool UpdatePartBaseOnRelational { get; set; }
        public bool UpdatePartNameOnly { get; set; }
        public Func<string, bool> CallbackNotification { get; set; }
        public bool IsIncrementalIndex { get; set; }
        public bool UpdateModelPageLinkOnly { get; set; }
    }
    public class SparePartIndexArguments
    {
        public bool IndexPartCategoriesOnly { get; set; }
        public bool IsIncrementalIndex { get; set; }
        public string[] Markets { get; set; }
        public string[] Categories { get; set; }
        public string[] VirtualModels { get; set; }
        public string LanguageName { get; set; }
        public string RootPartCategoryCode { get; set; }
        public int TemPartsCategoryId { get; set; }
        public int IndexPageSize { get; set; }
        public Func<string, bool> CallbackNotification { get; set; }
    }
    #endregion
}