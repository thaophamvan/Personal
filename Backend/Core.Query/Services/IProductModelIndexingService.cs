using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Core.Querying.Infrastructure.Configuration;
using Platform.Models.CMS.Pages;
using Platform.Models.Commerce.V3;
using Platform.Models.Models.Market;
using Platform.Models.ViewModels.Search;
using EPiServer;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Core;
using EPiServer.Logging;
using EPiServer.ServiceLocation;
using Mediachase.Commerce;

namespace Core.Querying.Services
{
    public interface IProductModelIndexingService : ILoggingService
    {
        IndexContentResult IndexModels(List<ModelProduct> models, CultureInfo language, BrandMarketMapping[] marketIdsMapping, Func<string, bool> callbackNotification = null, int indexPageSize = 20);
    }

    [ServiceConfiguration(typeof(IProductModelIndexingService))]
    public class ProductModelIndexingService : ServicesBase, IProductModelIndexingService
    {
        private int _maxItemsIndex = 20;

        public IndexContentResult IndexModels(List<ModelProduct> models, CultureInfo language, BrandMarketMapping[] marketIdsMapping, Func<string, bool> callbackNotification = null, int indexPageSize = 20)
        {
            _maxItemsIndex = indexPageSize;

            var indexedCounter = 0;
            var notIndexedCounter = 0;
            var result = new IndexContentResult();
            var itemsIndex = new List<ModelProduct>();

            result.OutData = new List<IContent>();
            result.Status = true;

            foreach (var modelProduct in models)
            {
                var itemKey = $"{modelProduct.ModelNumber}-{modelProduct.ContentLink.ID}";

                try
                {
                    var markets = marketIdsMapping.Where(x =>
                                x.BrandCode.Equals(modelProduct.Brand, StringComparison.InvariantCultureIgnoreCase)).ToList();
                    if (markets.Any())
                    {
                        modelProduct.MarketList = markets.Select(x => x.MarketId).ToList();
                    }
                    else
                    {
                        throw new Exception($"Market not found with brand: {modelProduct.Brand}");
                    }

                    modelProduct.Pncs = GetItems<PncProduct>(modelProduct.GetVariants().ToArray(), language).Select(x => x.PNC);

                    //Index individual item
                    //Index(modelProduct);
                    //InvokeNotification(callbackNotification, $"IndexModels Indexed Model: {itemKey}");

                    //Index the list items
                    itemsIndex.Add(modelProduct);
                    IndexTheList(itemsIndex, callbackNotification);

                    indexedCounter++;
                    result.OutData.Add(modelProduct);
                }
                catch (Exception e)
                {
                    notIndexedCounter++;
                    var msg = $"ProductModelIndexingService::IndexModels ERROR Cannot Index the Model: {itemKey}, error: {e.Message}";
                    result.Status = false;
                    result.Message += $"\r\n{itemKey}";
                    Logger.Error(msg, e);
                    InvokeNotification(callbackNotification, msg);
                }
            }

            IndexTheList(itemsIndex, callbackNotification, true);

            result.Message = $"Indexed {indexedCounter} Parts and Failed {notIndexedCounter} Parts!. Fail List:\r\n{result.Message}";
            return result;
        }

        private void IndexTheList(List<ModelProduct> itemsIndex, Func<string, bool> callbackNotification, bool isLastBatch = false)
        {
            if (isLastBatch && itemsIndex.Count > 0 || itemsIndex.Count >= _maxItemsIndex)
            {
                Index(itemsIndex);
                InvokeNotification(callbackNotification, $"IndexParts:: Indexed: {string.Join("\r\n", itemsIndex.Select(x => $"{x.ModelNumber}-{x.ContentLink.ID}")) }");
                itemsIndex.Clear();
            }
        }

    }
}
