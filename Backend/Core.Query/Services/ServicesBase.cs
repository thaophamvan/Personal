using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Core.Querying.Infrastructure.Configuration;
using Platform.DataCache;
using Platform.Models.CMS.Pages;
using Platform.Models.CMS.Pages.SparePart;
using Platform.Models.Commerce.V3;
using Platform.Models.Services.Implementation;
using Platform.Models.ViewModels.Commerce.Product;
using EPiServer;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Core;
using EPiServer.Find.Api;
using EPiServer.Find.Cms;
using EPiServer.Logging;
using EPiServer.ServiceLocation;
using EPiServer.Web;

namespace Core.Querying.Services
{
    public class ServicesBase : ILoggingService
    {
        protected IContentLoader _contentLoader;
        private static readonly DataCacheHandler Cache = new DataCacheHandler();
        private readonly ILogger _logger = LogManager.GetLogger(System.Reflection.MethodBase.GetCurrentMethod().ReflectedType);
        protected Injected<ISiteDefinitionResolver> siteDefinitionResolver { get; set; }
        protected SiteSettingsHandler _siteSettingHandler { get; set; }
        public ServicesBase()
        {
            _contentLoader = ServiceLocator.Current.GetInstance<IContentLoader>();
            _siteSettingHandler = ServiceLocator.Current.GetInstance<SiteSettingsHandler>();
        }

        protected TResult ExecuteAndCache<TResult>(string cacheKey, List<string> cacheKeys, List<string> masterKeys, Func<TResult> methodToCall, TResult defaultResult, TimeSpan timeout, string resourceKey, bool isAbsolute = true)
        {
            TResult result;
            if ((_siteSettingHandler.SiteSettingsPage as SiteSettingsPage).CacheEnabled && !string.IsNullOrWhiteSpace(cacheKey))
            {
                result = Cache.ExecuteAndCache(cacheKey, cacheKeys, masterKeys, methodToCall, defaultResult, timeout, resourceKey, isAbsolute);
                return result;
            }

            Cache.Remove(cacheKey);
            result = methodToCall.Invoke();

            return result == null ? defaultResult : result;
        }

        protected TResult ExecuteAndCache<TResult>(string cacheKey, Func<TResult> methodToCall, TResult defaultResult, TimeSpan timeout, string resourceKey, bool isAbsolute = true)
        {
            TResult result;
            if ((_siteSettingHandler.SiteSettingsPage as SiteSettingsPage).CacheEnabled && !string.IsNullOrWhiteSpace(cacheKey))
            {
                result = Cache.ExecuteAndCache(cacheKey, methodToCall, defaultResult, timeout, resourceKey, isAbsolute);
                return result;
            }

            Cache.Remove(cacheKey);
            result = methodToCall.Invoke();

            return result == null ? defaultResult : result;
        }

        protected TResult ExecuteWithoutCache<TResult>(Func<TResult> methodToCall, TResult defaultResult)
        {
            TResult result = methodToCall.Invoke();
            return result == null ? defaultResult : result;
        }
        public ILogger Logger { get { return _logger; } }

        public virtual void Index(IContent item)
        {
            try
            {
                ContentDataQueryHandler.Instance.Create().Index(item);
            }
            catch (Exception e)
            {
                Logger.Error($"Cannot index the IContent: {item.ContentLink.ID}-{item.Name}", e);
            }
        }

        public virtual BulkResult Index(List<PartProduct> items)
        {
            BulkResult result = new BulkResult { Took = 0, Items = new List<BulkResultItem>() };
            try
            {
                result = ContentDataQueryHandler.Instance.Create().Index(items);
                _logger.Error($"Indexed {items.Count} Parts took {result.Took}: {string.Join(",", items.Select(x => $"{x.PartNumber}-{x.ContentLink.ID}"))}\r\nStatus [Id-Ok-Error]: {GetIndexResult(result)}");
            }
            catch (Exception e)
            {
                _logger.Error($"Cannot index {items.Count} Parts: {string.Join("\r\n", items.Select(x => $"{x.PartNumber}-{x.ContentLink.ID}"))}", e);
            }

            return result;
        }
        public virtual BulkResult Index(List<PncProduct> items)
        {
            BulkResult result = new BulkResult { Took = 0, Items = new List<BulkResultItem>() };

            try
            {
                result = ContentDataQueryHandler.Instance.Create().Index(items);
                _logger.Error($"Indexed {items.Count} PNCs took {result.Took}: {string.Join(",", items.Select(x => $"{x.PNC}-{x.ContentLink.ID}"))}\r\nStatus [Id-Ok-Error]: {GetIndexResult(result)}");
            }
            catch (Exception e)
            {
                _logger.Error($"Cannot index {items.Count} PNCs: {string.Join("\r\n", items.Select(x => $"{x.PNC}-{x.ContentLink.ID}"))}", e);
            }

            return result;
        }

        public virtual BulkResult Index(List<ModelProduct> items)
        {
            BulkResult result = new BulkResult { Took = 0, Items = new List<BulkResultItem>() };

            try
            {
                result = ContentDataQueryHandler.Instance.Create().Index(items);
                _logger.Error($"Indexed {items.Count} Models took {result.Took}: {string.Join(",", items.Select(x => $"{x.ModelNumber}-{x.ContentLink.ID}"))}\r\nStatus [Id-Ok-Error]: {GetIndexResult(result)}");

            }
            catch (Exception e)
            {
                _logger.Error($"Cannot index {items.Count} Models: {string.Join("\r\n", items.Select(x => $"{x.ModelNumber}-{x.ContentLink.ID}"))}", e);
            }

            return new BulkResult
            {
                Items = new List<BulkResultItem>(),
                Took = 0
            };
        }

        public virtual void Delete(IContent item)
        {
            try
            {
                ContentIndexer.Instance.TryDelete(item, out var deleteResult);
                _logger.Error($"INFO Delete the IContent: {item.ContentLink.ID}-{item.Name} Ok = {deleteResult.First().Ok}");
            }
            catch (Exception e)
            {
                _logger.Error($"ERROR Cannot Delete the IContent: {item.ContentLink.ID}-{item.Name}", e);
            }
        }
        public virtual void Delete(List<IContent> items)
        {
            foreach (var item in items)
            {
                try
                {
                    ContentIndexer.Instance.TryDelete(item, out var deleteResult);
                    _logger.Error($"INFO Delete the IContent: {item.ContentLink.ID}-{item.Name} Ok = {deleteResult.First().Ok}");

                }
                catch (Exception e)
                {
                    _logger.Error($"ERROR Cannot Delete the IContent: {item.ContentLink.ID}-{item.Name}", e);
                }

            }
        }

        public virtual void Index(IndexableModel item)
        {
            try
            {
                BeforeIndexSetup();
                ContentDataQueryHandler.Instance.Create().Index(item);
            }
            catch (Exception e)
            {
                _logger.Error($"Cannot index the IndexableModel: {item.Id}", e);
            }

        }

        public virtual BulkResult Index(List<IndexableModel> items)
        {
            if (items.Any())
            {
                BeforeIndexSetup();

                var result = ContentDataQueryHandler.Instance.Create().Index(items);
                _logger.Error($"Indexed IndexableModels took {result.Took}: {string.Join(",", items.Select(x => $"{x.Id}"))}\r\nStatus [Id-Ok-Error]: {GetIndexResult(result)}");

                return result;
            }
            return new BulkResult
            {
                Items = new List<BulkResultItem>(),
                Took = 0
            };
        }

        public virtual BulkResult Index(List<AccessoryCategoryIndexingViewModel> items)
        {
            if (items.Any())
            {
                BeforeIndexSetup();

                var result = ContentDataQueryHandler.Instance.Create().Index(items);
                _logger.Error($"Indexed AccessoryCategoryIndexingViewModel took {result.Took}: {string.Join(",", items.Select(x => $"{x.Id}\t{x.Name}"))}\r\nStatus [Id-Ok-Error]: {GetIndexResult(result)}");

                return result;
            }
            return new BulkResult
            {
                Items = new List<BulkResultItem>(),
                Took = 0
            };
        }
        public virtual BulkResult Index(List<PartCategory> items)
        {
            if (items.Any())
            {
                BeforeIndexSetup();

                var result = ContentDataQueryHandler.Instance.Create().Index(items);

                _logger.Error($"Indexed PartCategory took {result.Took}: {string.Join(",", items.Select(x => $"{x.ContentLink.ID}\t{x.Name}"))}\r\nStatus [Id-Ok-Error]: {GetIndexResult(result)}");

                return result;
            }
            return new BulkResult
            {
                Items = new List<BulkResultItem>(),
                Took = 0
            };

        }

        public virtual void BeforeIndexSetup()
        {
            //DoNothing
        }

        public virtual IEnumerable<T> GetEntriesRecursive<T>(ContentReference parentLink, CultureInfo defaultCulture) where T : EntryContentBase
        {
            foreach (var nodeContent in LoadChildrenBatched<NodeContent>(parentLink, defaultCulture))
            {
                foreach (var entry in GetEntriesRecursive<T>(nodeContent.ContentLink, defaultCulture))
                {
                    yield return entry;
                }
            }

            foreach (var entry in LoadChildrenBatched<T>(parentLink, defaultCulture))
            {
                yield return entry;
            }
        }

        public virtual IEnumerable<T> GetNodesRecursive<T>(ContentReference parentLink, CultureInfo defaultCulture) where T : NodeContent
        {
            foreach (var nodeContent in LoadChildrenBatched<NodeContent>(parentLink, defaultCulture))
            {
                foreach (var entry in GetNodesRecursive<T>(nodeContent.ContentLink, defaultCulture))
                {
                    yield return entry;
                }
            }

            foreach (var entry in LoadChildrenBatched<T>(parentLink, defaultCulture))
            {
                yield return entry;
            }
        }

        public virtual IEnumerable<T> GetItems<T>(ContentReference[] listContentReferences, CultureInfo defaultCulture) where T : IContent
        {
            foreach (var contentRef in listContentReferences)
            {
                if (_contentLoader.TryGet<T>(contentRef, defaultCulture, out T content))
                {
                    yield return content;
                }
            }
        }

        protected virtual void InvokeNotification(Func<string, bool> callbackNotification, string resultMessage)
        {
            if (callbackNotification != null) callbackNotification.Invoke(resultMessage);
        }

        protected virtual bool TryGetSiteUrlFromPage(ISparePartCategoryPage productModelCategoryPage, out string siteUrl, Func<string, bool> callbackNotification = null)
        {

            siteUrl = "";

            try
            {
                var pageUrl = productModelCategoryPage.FriendlyUrl;
                var Url = new Url(pageUrl);
                siteUrl = $"{Url.Scheme}://{Url.Host}/";

                return true;
            }
            catch (Exception e)
            {
                return false;
            }


            //siteUrl = "";
            //var siteDef = siteDefinitionResolver.Service.GetByContent(productModelCategoryPage.ContentLink, true);
            //if (siteDef == null || siteDef.SiteUrl == null)
            //{
            //    InvokeNotification(callbackNotification,
            //        $"IndexPnc:: Site definition of the model category page: {productModelCategoryPage.Name} is NULL or does not have SiteUrl! Skip process...");
            //    return false;
            //}

            //siteUrl = siteDef.SiteUrl.ToString();
            //return !string.IsNullOrWhiteSpace(siteUrl);
        }

        private IEnumerable<T> LoadChildrenBatched<T>(ContentReference parentLink, CultureInfo defaultCulture) where T : IContent
        {
            var start = 0;

            while (true)
            {
                IEnumerable<T> batch;

                try
                {
                    batch = _contentLoader.GetChildren<T>(parentLink, defaultCulture, start, 50);
                }
                catch (Exception e)
                {
                    Logger.Error($"LoadChildrenBatched ERROR: try get content link NULL: {parentLink.ID}", e);
                    yield break;
                }


                if (!batch.Any())
                {
                    yield break;
                }

                foreach (var content in batch)
                {
                    // Don't include linked products to avoid including them multiple times when traversing the catalog
                    if (!parentLink.CompareToIgnoreWorkID(content.ParentLink))
                    {
                        continue;
                    }

                    yield return content;
                }
                start += 50;
            }
        }

        private string GetIndexResult(BulkResult result)
        {
            return string.Join(",", result.Items.Select(x => $"{x.Id}-{x.Ok}-{x.Error}"));
        }
    }

    public interface ILoggingService
    {
        ILogger Logger { get; }
    }
}
