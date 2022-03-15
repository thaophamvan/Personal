using System;
using System.Collections.Generic;
using System.Linq;
using Platform.Models.Commerce.V2;
using Platform.Models.Commerce.V3;
using Platform.Models.Commerce.Validators;
using Platform.Models.Models.Market;
using Platform.Models.ViewModels.Part;
using EPiServer;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Core;
using EPiServer.ServiceLocation;
using Mediachase.Commerce;
using Mediachase.Commerce.Catalog;
using Mediachase.Commerce.InventoryService;
using Mediachase.Commerce.Markets;
using Mediachase.Commerce.Pricing;

namespace Core.Querying.Find.Extensions.Content
{
    public static class VariationExtensions
    {
        private static IContentRepository _contentRepository;
        private static IContentLoader _contentLoader;
        private static IPriceService _priceService;
        private static IPriceDetailService _priceDetailService;
        private static IMarketService _marketService;
        private static IInventoryService _inventoryService;
        private static PartMarketValidatorFactory _partMarketValidatorFactory;

        public static PartMarketValidatorFactory PartMarketValidatorFactory
        {
            get
            {
                if (_partMarketValidatorFactory == null)
                {
                    _partMarketValidatorFactory = ServiceLocator.Current.GetInstance<PartMarketValidatorFactory>();
                }

                return _partMarketValidatorFactory;
            }

        }
        public static IInventoryService InventoryService
        {
            get
            {
                if (_inventoryService == null)
                {
                    _inventoryService = ServiceLocator.Current.GetInstance<IInventoryService>();
                }

                return _inventoryService;
            }

        }

        public static IMarketService MarketService
        {
            get
            {
                if (_marketService == null)
                {
                    _marketService = ServiceLocator.Current.GetInstance<IMarketService>();
                }

                return _marketService;
            }

        }
        public static IPriceDetailService PriceDetailService
        {
            get
            {
                if (_priceDetailService == null)
                {
                    _priceDetailService = ServiceLocator.Current.GetInstance<IPriceDetailService>();
                }

                return _priceDetailService;
            }

        }
        public static IPriceService PriceService
        {
            get
            {
                if (_priceService == null)
                {
                    _priceService = ServiceLocator.Current.GetInstance<IPriceService>();
                }

                return _priceService;
            }

        }
        public static IContentRepository ContentRepository
        {
            get
            {
                if (_contentRepository == null)
                {
                    _contentRepository = ServiceLocator.Current.GetInstance<IContentRepository>();
                }

                return _contentRepository;
            }

        }

        public static IContentLoader ContentLoader
        {
            get
            {
                if (_contentLoader == null)
                {
                    _contentLoader = ServiceLocator.Current.GetInstance<IContentLoader>();
                }

                return _contentLoader;
            }

        }

        public static bool IsPublishedAndNotExpired(this VariationContent variation)
        {
            return (variation.Status == VersionStatus.Published) && (!variation.StopPublish.HasValue || variation.StopPublish.Value > DateTime.Now);
        }
        public static bool IsAvailable(this VariationContent variation)
        {
            return variation.IsPublishedAndNotExpired();
        }

        /// <summary>
        /// V1. Return true if has any Retail price from a given list of market, in V2 would be check Trade Price and Deal price
        /// </summary>
        /// <param name="part"></param>
        /// <param name="marketIds"></param>
        /// <returns></returns>
        public static bool HasAnyValidPrice(this ProductContent part, MarketId[] marketIds)
        {

            var variantRefs = part.GetVariants().ToList();
            if (!variantRefs.Any())
            {
                return false;
            }
            var variants = variantRefs.Select(x => ContentRepository.Get<EntryContentBase>(x)).ToArray();

            try
            {
                var catalogKeys = variants.Select(x => new CatalogKey(x.Code));

                var plist = marketIds.Select(x => GetRetailPrices(x, catalogKeys));

                return plist.Any(x => x.Any(p => p.UnitPrice.Amount > 0));
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        /// <summary>
        /// Get first retail price of the part
        /// </summary>
        /// <param name="part"></param>
        /// <param name="marketId"></param>
        /// <returns></returns>
        public static decimal GetRetailPrice(this ProductContent part, MarketId marketId)
        {
            var variantRefs = part.GetVariants().ToList();
            if (!variantRefs.Any())
            {
                return 0;
            }

            try
            {
                var variants = variantRefs.Select(x => ContentRepository.Get<EntryContentBase>(x)).ToArray();

                var catalogKeys = variants.Select(x => new CatalogKey(x.Code));
                var price = GetRetailPrices(marketId, catalogKeys).FirstOrDefault();
                return price?.UnitPrice.Amount ?? 0;
            }
            catch (Exception exception)
            {
                throw exception;
            }
        }

        /// <summary>
        /// Get Parents categories level 1 and level 2 of the part
        /// </summary>
        /// <param name="part"></param>
        /// <returns></returns>
        public static List<PartCategoryBriefItem> GetParentCategories(this ProductContent part)
        {
            var partCategoryRefs = part.GetCategories();
            var categories = ContentLoader.GetItems(partCategoryRefs, part.Language);

            var level2 = categories.Select(x => new PartCategoryBriefItem
            {
                Name = x.Name,
                ContentLink = x.ContentLink,
                ParentLink = x.ParentLink,
                Level = 2
            }).ToList();

            var parentOfL2Links = level2.Select(x => x.ParentLink);
            categories = ContentLoader.GetItems(parentOfL2Links, part.Language);

            var level1 = categories.Select(x => new PartCategoryBriefItem
            {
                Name = x.Name,
                ContentLink = x.ContentLink,
                ParentLink = x.ParentLink,
                Level = 1
            }).ToList();

            return level1.Any() ? level2.Concat(level1).ToList() : level2;
        }

        /// <summary>
        /// Get Parents categories level 1 and level 2 of Model Product from given part
        /// </summary>
        /// <param name="part"></param>
        /// <returns></returns>
        public static List<PartCategoryBriefItem> GetProductCategories(this ProductContent part)
        {
            var parentRelatedEntries = part.GetRelatedEntries();
            var products = ContentLoader.GetItems(parentRelatedEntries, part.Language).Where(x => x is ModelProduct);
            List<PartCategoryBriefItem> lst = new List<PartCategoryBriefItem>();

            foreach (var product in products)
            {
                lst.AddRange((product as ProductContent).GetParentCategories());
            }

            return lst;
        }

        public static bool GetStockAvailable(this ProductContent part)
        {
            var variantRefs = part.GetVariants().ToList();
            if (!variantRefs.Any())
            {
                return false;
            }

            var variants = ContentLoader.GetItems(variantRefs, part.Language).Cast<PartVariation>();

            foreach (var v in variants)
            {
                var stocks = v.GetStockPlacement();
                if (stocks.Any(x => x.InStockQuantity > 0))
                {
                    return true;
                }
            }

            return false;
        }


        ///// <summary>
        ///// A part can be displayed if has price AND the parents model in the given markets
        ///// </summary>
        ///// <param name="part"></param>
        ///// <param name="marketIds">The market list to be checking</param>
        ///// <param name="displayableDetails">Out details displayable of part in the markets</param>
        ///// <returns></returns>
        //public static bool Displayable(this PartProduct part, MarketId[] marketIds, out MarketDisplayable[] displayableDetails)
        //{
        //    displayableDetails = marketIds.Select(x => new MarketDisplayable
        //    {
        //        MarketId = x
        //    }).ToArray();

        //    if (!part.IsActive())
        //    {
        //        return false;
        //    }

        //    foreach (var displayableDetail in displayableDetails)
        //    {
        //        var validator = PartMarketValidatorFactory.GetValidator(displayableDetail.MarketId);
        //        displayableDetail.Displayable = validator.CanDisplay(part);
        //    }

        //    return displayableDetails.Any(x => x.Displayable);

        //    //if (!part.HasAnyValidPrice(displayableDetails))
        //    //{
        //    //    return false;
        //    //}

        //    //try
        //    //{

        //    //    foreach (var displayable in displayableDetails)
        //    //    {
        //    //        //Check if part belong to any model listing that can be displayed
        //    //        var modelPage = part.ModelPageList?.FirstOrDefault(x => x.MarketId.Equals(displayable.MarketId.Value, StringComparison.InvariantCultureIgnoreCase));
        //    //        displayable.Displayable = modelPage != null;
        //    //        displayable.Reason = modelPage == null ? "Doesn't have relevance model listing page!" : "";
        //    //    }

        //    //    if (!displayableDetails.Any(x => x.Displayable))
        //    //    {
        //    //        return false;
        //    //    }


        //    //}
        //    //catch (Exception exception)
        //    //{
        //    //    throw exception;
        //    //}
        //}

        //public static bool Displayable(this PartProduct part, MarketId marketId, out MarketDisplayable displayableReason)
        //{
        //    var result = Displayable(part, new MarketId[] { marketId }, out var displayDetails);

        //    displayableReason = displayDetails.FirstOrDefault();

        //    return result;
        //}
        /// <summary>
        /// Get all PRIMARY relevant categories of part that can be displayed on menu (consisting Part Categories and Accessory Categories).
        /// For accessory category then get the closest category, the normal category then get the parent level of closest category.
        /// </summary>
        /// <param name="part"></param>
        /// <returns></returns>
        public static PartCategory[] DisplayableCategories(this ProductContent part)
        {
            var partCategoryContents = new List<PartCategory>();
            //Try fix to use single function indexing part. To be remove this comment.
            var additionalNodes = new List<ContentReference>(); //part.GetNodeRelations().OfType<NodeEntryRelation>().Where(x => !x.IsPrimary).Select(x => x.Parent);

            var partCategories = part.GetCategories();
            var categories = ContentLoader.GetItems(partCategories, part.Language).OfType<PartCategory>().ToList();
            foreach (var category in categories.Where(x => x.IsAccessory && !x.IsHideOnMenu && !additionalNodes.Contains(x.ContentLink)))
            {
                partCategoryContents.Add(category);
            }

            foreach (var category in categories.Where(x => !x.IsAccessory && !x.IsHideOnMenu && !additionalNodes.Contains(x.ContentLink)))
            {
                var parents = ContentLoader.GetItems(category.GetCategories().Append(category.ParentLink), part.Language)
                    .OfType<PartCategory>().Where(x => !x.IsHideOnMenu).ToList();
                if (parents.Any())
                {
                    partCategoryContents.AddRange(parents);
                    //partCategoryContents.Add(category);
                }
                else
                {
                    partCategoryContents.Add(category);
                }
            }

            return partCategoryContents.Distinct().ToArray();
        }

        public static IEnumerable<IPriceValue> GetRetailPrices(MarketId marketId, IEnumerable<CatalogKey> catalogKeys)
        {
            return PriceService.GetPrices(marketId, DateTime.UtcNow, catalogKeys, new PriceFilter { CustomerPricing = new CustomerPricing[] { CustomerPricing.AllCustomers } });
        }
        public static IEnumerable<IPriceValue> GetCustomerPrices(MarketId marketId, IEnumerable<CatalogKey> catalogKeys, IEnumerable<string> customerGroups)
        {
            var filters = new List<CustomerPricing>();
            filters.Add(CustomerPricing.AllCustomers);
            if (customerGroups != null && customerGroups.Any())
            {
                foreach (var group in customerGroups)
                {
                    filters.Add(new CustomerPricing(CustomerPricing.PriceType.PriceGroup, group));
                }
            }
            return PriceService.GetPrices(marketId, DateTime.UtcNow, catalogKeys, 
                new PriceFilter { CustomerPricing = filters.ToArray() });
        }

        public static int GetB2CStockAvailability(this ProductContent part)
        {
            var variantRefs = part.GetVariants().ToList();
            if (!variantRefs.Any()) return 0;

            var variants = ContentLoader.GetItems(variantRefs, part.Language).Cast<PartVariation>();
            var totalQty = variants.Sum(x => x.GetStockPlacement()?.FirstOrDefault(i => i.WarehouseCode.Equals("default"))?.InStockQuantity ?? 0);
            return (int)totalQty;
        }
    }
}