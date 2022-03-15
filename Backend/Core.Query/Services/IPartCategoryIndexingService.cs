using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using Core.Querying.Find.Extensions.Content;
using Platform.Models;
using Platform.Models.CMS.Pages.SparePart;
using Platform.Models.CMS.Properties;
using Platform.Models.Commerce.V2;
using Platform.Models.Commerce.V3;
using Platform.Models.Helpers;
using Platform.Models.ViewModels.Category;
using Platform.Models.ViewModels.Commerce.Product;
using Platform.Models.ViewModels.Search;
using EPiServer;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Core;
using EPiServer.Find.Helpers;
using EPiServer.Logging;
using EPiServer.ServiceLocation;
using EPiServer.Web;
using Mediachase.Commerce;
using Newtonsoft.Json;

namespace Core.Querying.Services
{
    public interface IPartCategoryIndexingService : ILoggingService
    {
        //ContentReference[] GetPartCatalogByModelCatalogFromDb(ContentReference modelCatalogRef, CultureInfo language, MarketId[] marketIds);
        IndexContentResult IndexPartCategories(PartCategory[] partCategories, CultureInfo language, MarketId[] marketIds, Func<string, bool> callbackNotification = null, int pageIndexSize = 20);
        bool Delete(List<PartCategory> partNeedToRemoved);
    }


    [ServiceConfiguration(typeof(IPartCategoryIndexingService))]
    public class PartCategoryIndexingService : ServicesBase, IPartCategoryIndexingService
    {
        public PartCategoryIndexingService()
        {
        }

        public IndexContentResult IndexPartCategories(PartCategory[] partCategories, CultureInfo language, MarketId[] marketIds,
            Func<string, bool> callbackNotification = null, int pageIndexSize = 20)
        {
            var partCategoriesIndex = new List<PartCategory>();
            var indexedCategoriesResult = 0;
            var indexedCatAccessoriesResult = 0;

            foreach (var partCategory in partCategories)
            {
                Logger.Error($"PartCategoryIndexingService::IndexPartCategories INFO indexed category {partCategory.Name} with url:\r\n{JsonConvert.SerializeObject(partCategory.CategoryLinks)}");
                partCategory.IndexedDate = DateTime.Now.ToUniversalTime().ToString("dd-MM-yyyy hh:mm:ss");
                var partCategorySegment = UrlHelpers.GetPartSegment(partCategory);
                if (partCategory.IsAccessory)
                {
                    partCategorySegment = $"{partCategorySegment}-accessory";
                }
                if (partCategory.ModelPageListFromParts != null && partCategory.ModelPageListFromParts.Any())
                {
                    partCategory.CategoryLinks = partCategory.ModelPageListFromParts.Select(x => new PartCategoryLink
                    {
                        MarketId = x.MarketId,
                        Text = partCategory.DisplayName,
                        ModelCategoryCode = x.ModelCategoryCode,
                        ModelCategoryName = x.ModelCategoryName,
                        ParentSegment = x.Key,
                        MySegment = partCategorySegment,
                        Key = $"{x.Key}/{partCategorySegment}",
                        Url = $"{x.Url.Trim('/')}/{partCategorySegment}/"
                    });

                    partCategory.MarketList = partCategory.CategoryLinks.Select(x => x.MarketId).Distinct().ToList();

                    partCategoriesIndex.Add(partCategory);
                }
                if (partCategoriesIndex.Count >= pageIndexSize)
                {
                    var r = Index(partCategoriesIndex);
                    indexedCategoriesResult += r.Items.Count(x => x.Ok);
                    Logger.Error($"IndexPartCategories:: INFO Indexed categories: { string.Join("\r\n", partCategoriesIndex.Select(x => $"{x.Code}-{x.ContentLink.ID}"))}");
                    partCategoriesIndex.Clear();

                }
            }

            if (partCategoriesIndex.Count > 0)
            {
                var r = Index(partCategoriesIndex);
                indexedCategoriesResult += r.Items.Count(x => x.Ok);
                Logger.Error($"IndexPartCategories:: INFO Indexed categories: { string.Join("\r\n", partCategoriesIndex.Select(x => $"{x.Code}-{x.ContentLink.ID}"))}");
                partCategoriesIndex.Clear();
            }


            //Index accessories
            var accessoryCategories = partCategories.Where(x => x.IsAccessory && x.ModelPageListFromParts != null && x.ModelPageListFromParts.Any());
            var pageList = new List<ModelPartPageLink>();
            accessoryCategories.ForEach(x => pageList.AddRange(x.ModelPageListFromParts.ToList()));
            var pageAccessoryList = new List<AccessoryCategoryIndexingViewModel>();

            foreach (var modelPartPageLink in pageList)
            {
                if (!_contentLoader.TryGet(new ContentReference(modelPartPageLink.PageId), out ProductModelCategoryPage modelListingPage)
                    || modelListingPage == null || !modelListingPage.VisibleInMenu)
                {
                    continue;
                }

                var p = pageAccessoryList.FirstOrDefault(x => x.Id.Equals(modelPartPageLink.PageId));

                if (p == null)
                {
                    pageAccessoryList.Add(new AccessoryCategoryIndexingViewModel
                    {
                        Id = modelPartPageLink.PageId,
                        Name = modelPartPageLink.ModelCategoryName,
                        //ContentLink = new ContentLink,
                        Url = $"{modelPartPageLink.Url.TrimEnd('/')}/{Constant.AccessoryCategoryNameUrl}",
                        MarketList = new List<string> { modelPartPageLink.MarketId },
                        IsModelCategory = false,
                        IndexedDate = DateTime.Now.ToUniversalTime().ToString("dd-MM-yyyy hh:mm:ss")
                    });
                }
                else
                {
                    p.MarketList = p.MarketList.Concat(new List<string>() { modelPartPageLink.MarketId }).Distinct();
                }

                if (pageAccessoryList.Count >= pageIndexSize)
                {
                    var r = Index(pageAccessoryList);
                    indexedCatAccessoriesResult += r.Items.Count(x => x.Ok);
                    Logger.Error($"IndexPartCategories:: INFO Indexed categories: { string.Join("\r\n", pageAccessoryList.Select(x => $"{x.Name}-{x.Id}"))}");

                    pageAccessoryList.Clear();
                }
            }

            if (pageAccessoryList.Count > 0)
            {
                var r = Index(pageAccessoryList);
                indexedCatAccessoriesResult += r.Items.Count(x => x.Ok);
                Logger.Error($"IndexPartCategories:: INFO Indexed categories: { string.Join("\r\n", pageAccessoryList.Select(x => $"{x.Name}-{x.Id}"))}");
                pageAccessoryList.Clear();
            }


            return new IndexContentResult
            {
                Status = true,
                Message = $"Done with statuses Part Categories:{indexedCategoriesResult} items, Part Accessories: {indexedCatAccessoriesResult} items. Check log for details."
            };
        }

        public bool Delete(List<PartCategory> partCategoryNeedToRemoved)
        {
            try
            {
                base.Delete(partCategoryNeedToRemoved.Cast<IContent>().ToList());
                return true;
            }
            catch (Exception e)
            {
                Logger.Error($"IndexPartCategories:: ERROR Delete list of PartCategory error: {e}", e);
                return false;
            }
        }
    }

}