using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Core.Querying.Find.Extensions.Content;
using Platform.Models.CMS.Pages.SparePart;
using Platform.Models.Commerce.V2;
using Platform.Models.Commerce.V3;
using Platform.Models.Helpers;
using Platform.Models.Models.Market;
using Platform.Models.ViewModels.Commerce.Product;
using Platform.Models.ViewModels.Search;
using EPiServer;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Core;
using EPiServer.Find.Helpers;
using EPiServer.Logging;
using EPiServer.ServiceLocation;
using EPiServer.Web.Routing;
using Mediachase.Commerce;

namespace Core.Querying.Services
{
    public interface IPncIndexingService : ILoggingService
    {
        /// <summary>
        /// Index Pnc of  given product category page. Return list of part content links
        /// </summary>
        /// <param name="catPages"></param>
        /// <param name="language"></param>
        /// <param name="marketIdsMapping"></param>
        /// <param name="modelLinks"></param>
        /// <param name="partCategories"></param>
        /// <param name="callbackNotification"></param>
        /// <returns></returns>
        //int IndexPnc(ProductModelCategoryPage[] catPages, CultureInfo language,
        //    BrandMarketMapping[] marketIdsMapping, out int numberOfIndexedModels, out int numberOfIndexedParts, out int numberOfIndexedAccessoryPages,
        //    out PartCategory[] partCategories, Func<string, bool> callbackNotification = null);

        /// <summary>
        /// Check if the pnc can be displayed itself but not should it has any parts for showing
        /// </summary>
        /// <param name="pnc">PNC need to be displayed</param>
        /// <param name="language">The current language</param>
        /// <param name="marketIdsMapping">Market IDs is used to checking</param>
        /// <param name="partCategoriesDisplayable">Out list of part categories can be displayed</param>
        /// <param name="indexedModels">The list store indexed model ids</param>
        /// <param name="indexedParts">The list store indexed part ids</param>
        /// <param name="callbackNotification">Notification call back</param>
        /// <param name="indexPageSize">Number of items per batch to index</param>
        /// <returns></returns>
        //bool PncIndexable(PncProduct pnc, CultureInfo language, BrandMarketMapping[] marketIdsMapping,
        //    out PartCategory[] partCategoriesDisplayable, List<int> indexedModels, List<int> indexedParts);
        IndexContentResult IndexPnc(List<PncProduct> pncs, CultureInfo language, BrandMarketMapping[] marketIdsMapping, Func<string, bool> callbackNotification, int indexPageSize = 20);
    }


    [ServiceConfiguration(typeof(IPncIndexingService))]
    public class PncIndexingService : ServicesBase, IPncIndexingService
    {
        private int _maxItemsIndex = 20;

        public IndexContentResult IndexPnc(List<PncProduct> pncs, CultureInfo language, BrandMarketMapping[] marketIdsMapping, Func<string, bool> callbackNotification, int indexPageSize = 20)
        {
            _maxItemsIndex = indexPageSize;
            var indexedCounter = 0;
            var notIndexedCounter = 0;
            var result = new IndexContentResult();
            var itemsIndex = new List<PncProduct>();

            result.OutData = new List<IContent>();
            result.Status = true;

            foreach (var pnc in pncs)
            {
                var itemKey = $"{pnc.PNC}-{pnc.ContentLink.ID}";

                try
                {
                    if (pnc.ModelsList != null && pnc.ModelsList.Any())
                    {
                        pnc.MarketList = pnc.ModelsList.Select(x => x.MarketId);
                        pnc.ModelName = pnc.ModelsList.First().Name;
                        pnc.IndexedDate = DateTime.Now.ToUniversalTime().ToString("dd-MM-yyyy hh:mm:ss");

                        //Index individual item
                        //Index(pnc);
                        //InvokeNotification(callbackNotification, $"IndexModels Indexed PNC: {itemKey}");

                        //Index the list items
                        itemsIndex.Add(pnc);
                        InvokeNotification(callbackNotification, $"IndexModels Added PNC to index list: {itemKey}");
                        IndexTheList(itemsIndex, callbackNotification);

                        indexedCounter++;
                        result.OutData.Add(pnc);

                    }
                }
                catch (Exception e)
                {
                    notIndexedCounter++;

                    var msg = $"PncIndexingService::IndexPnc ERROR Cannot Index the PNC: {itemKey}, error: {e.Message}";
                    result.Status = false;
                    result.Message += $"\r\n{itemKey}";
                    Logger.Error(msg, e);
                    InvokeNotification(callbackNotification, msg);
                }
            }

            IndexTheList(itemsIndex, callbackNotification, true);

            result.Message = $"Indexed {indexedCounter} PNCs and Failed {notIndexedCounter} PNCs!. Fail List:\r\n{result.Message}";
            return result;
        }
        
        private void IndexTheList(List<PncProduct> itemsIndex, Func<string, bool> callbackNotification, bool isLastBatch = false)
        {
            if (isLastBatch && itemsIndex.Count > 0 || itemsIndex.Count >= _maxItemsIndex)
            {
                Index(itemsIndex);
                InvokeNotification(callbackNotification, $"IndexParts:: Indexed: {string.Join("\r\n", itemsIndex.Select(x => $"{x.PNC}-{x.ContentLink.ID}")) }");
                itemsIndex.Clear();
            }
        }

    }

}