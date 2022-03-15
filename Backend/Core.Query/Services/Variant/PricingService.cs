using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using Platform.Models.Commerce.V2;
using Platform.Models.Commerce.V3;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Commerce.Marketing;
using EPiServer.Commerce.Marketing.Internal;
using EPiServer.Commerce.Order;
using EPiServer.Commerce.Order.Internal;
using EPiServer.Core;
using EPiServer.Find;
using EPiServer.ServiceLocation;
using Mediachase.Commerce;
using Mediachase.Commerce.Catalog;
using Mediachase.Commerce.Markets;
using Mediachase.Commerce.Pricing;

namespace Core.Querying.Services
{
    [ServiceConfiguration(typeof(IPricingService), Lifecycle = ServiceInstanceScope.Singleton)]
    public class PricingService : IPricingService
    {
        private readonly IPriceService _priceService;
        private readonly ICurrentMarket _currentMarket;
        private readonly ICurrencyService _currencyService;
        private readonly CatalogContentService _catalogContentService;
        private readonly ReferenceConverter _referenceConverter;
        private readonly IMarketService _marketService;
        private readonly ILineItemCalculator _lineItemCalculator;
        private readonly IPromotionEngine _promotionEngine;
        private readonly CustomerContextFacade _customerContextFacade;
        protected readonly IOrderGroupFactory _orderGroupFactory;
        protected readonly PromotionEngineContentLoader _promotionEngineContentLoader;

        public PricingService(
            IPriceService priceService,
            ICurrentMarket currentMarket,
            ICurrencyService currencyService,
            CatalogContentService catalogContentService,
            ReferenceConverter referenceConverter,
            IMarketService marketService,
            ILineItemCalculator lineItemCalculator,
            IPromotionEngine promotionEngine,
            CustomerContextFacade customerContextFacade,
            IOrderGroupFactory orderGroupFactory,
            PromotionEngineContentLoader promotionEngineContentLoader)
        {
            _priceService = priceService;
            _currentMarket = currentMarket;
            _currencyService = currencyService;
            _catalogContentService = catalogContentService;
            _referenceConverter = referenceConverter;
            _marketService = marketService;
            _lineItemCalculator = lineItemCalculator;
            _promotionEngine = promotionEngine;
            _customerContextFacade = customerContextFacade;
            _orderGroupFactory = orderGroupFactory;
            _promotionEngineContentLoader = promotionEngineContentLoader;
        }
        public IDictionary<CustomerPricing.PriceType, PriceTypeDefinition> GetAllPriceTypeDefinitions()
        {
            // Get all price types - included predefined and price types from configuration file.
            var priceTypeDefinitions = PriceTypeConfiguration.Instance.PriceTypeDefinitions;
            return priceTypeDefinitions;
        }
        /// <summary>
        /// Get Retailer price without promotion
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        public IPriceValue GetPrice(string code)
        {
            return GetPrice(code, _currentMarket.GetCurrentMarket().MarketId, _currencyService.GetCurrentCurrency());
        }
        /// <summary>
        /// Get Retailer price without promotion
        /// </summary>
        /// <param name="code"></param>
        /// <param name="marketId"></param>
        /// <param name="currency"></param>
        /// <returns></returns>
        public IPriceValue GetPrice(string code, MarketId marketId, Currency currency)
        {
            var priceFilter = PriceFilterHelper.BuildPriceFilter(currency);
            var price = _priceService.GetPrices(
                marketId,
                DateTime.Now,
                new CatalogKey(code),
                priceFilter)
                .OrderBy(x => x.UnitPrice.Amount);

            if (price == null || !price.Any())
            {
                priceFilter.CustomerPricing = new[] { CustomerPricing.AllCustomers };
                price = _priceService.GetPrices(
                        marketId,
                        DateTime.Now,
                        new CatalogKey(code),
                        priceFilter)
                    .OrderBy(x => x.UnitPrice.Amount);
            }


            return price.FirstOrDefault();
        }

        public IPriceValue GetDefaultPrice(string code)
        {
            var price = GetPrice(code, _currentMarket.GetCurrentMarket().MarketId.Value,
                            _currencyService.GetCurrentCurrency()) ?? _priceService.GetDefaultPrice(_currentMarket.GetCurrentMarket().MarketId, DateTime.Now, new CatalogKey(code), _currencyService.GetCurrentCurrency());

            return price;
        }

        public IEnumerable<IPriceValue> GetCatalogEntryPrices(IEnumerable<CatalogKey> catalogKeys)
        {
            return _priceService.GetCatalogEntryPrices(catalogKeys);
        }

        public IPriceValue GetDiscountedPrice(string code)
        {
            return GetDiscountedPrice(new CatalogKey(code), _currentMarket.GetCurrentMarket().MarketId, _currencyService.GetCurrentCurrency());
        }

        public IPriceValue GetDiscountedPrice(CatalogKey catalogKey, MarketId marketId, Currency currency)
        {
            var market = _marketService.GetMarket(marketId);

            currency = currency != Currency.Empty ? currency : market.DefaultCurrency;

            var priceFilter = PriceFilterHelper.BuildPriceFilter(currency);

            priceFilter.Quantity = 1;
            priceFilter.ReturnCustomerPricing = true;

            var prices = _priceService.GetPrices(marketId, DateTime.Now, catalogKey, priceFilter)
                .OrderBy(x => x.UnitPrice.Amount);

            if (prices == null || !prices.Any())
            {
                priceFilter.CustomerPricing = new[] { CustomerPricing.AllCustomers };
                prices = _priceService.GetPrices(marketId, DateTime.Now, catalogKey, priceFilter)
                    .OrderBy(x => x.UnitPrice.Amount);
            }

            foreach (var entry in GetEntries(prices))
            {
                var price = prices
                    .FirstOrDefault(x => x.CatalogKey.CatalogEntryCode.Equals(entry.Code) && x.UnitPrice.Currency.Equals(currency));
                if (price == null)
                {
                    continue;
                }

                var discountPrices = GetDiscountedPrices(entry.ContentLink, market, currency);
                if (discountPrices == null || !discountPrices.Any())
                {
                    return price;
                }

                return new PriceValue
                {
                    CatalogKey = price.CatalogKey,
                    CustomerPricing = CustomerPricing.AllCustomers,
                    MarketId = price.MarketId,
                    MinQuantity = 1,
                    UnitPrice = discountPrices.SelectMany(x => x.DiscountPrices).OrderBy(x => x.Price).First().Price,
                    ValidFrom = DateTime.UtcNow,
                    ValidUntil = null
                };
            }

            return null;
        }

        public Money GetMoney(decimal amount)
        {
            return new Money(amount, _currencyService.GetCurrentCurrency());
        }

        public Money GetDiscountedPrice(ILineItem lineItem, Currency currency)
        {
            return lineItem.GetDiscountedPrice(currency, _lineItemCalculator);
        }

        public Money GetVariantPrice(PlatformProduct product)
        {
            var variants = _catalogContentService.GetVariants<VariationContent>(product).ToArray();
            if (variants.Any() && variants.FirstOrDefault() != null && variants.FirstOrDefault()?.Code != null)
            {
                var defaultPrice = GetDefaultPrice(variants.FirstOrDefault()?.Code);
                var price = defaultPrice?.UnitPrice ?? GetMoney(0);
                return price;
            }

            return GetMoney(0);
        }

        protected virtual IEnumerable<EntryContentBase> GetEntries(IEnumerable<IPriceValue> prices)
        {
            return prices.GroupBy(x => x.CatalogKey.CatalogEntryCode)
                .Select(x => x.First())
                .Select(x => _catalogContentService.Get<EntryContentBase>(x.CatalogKey.CatalogEntryCode));
        }
        /// <summary>
        /// Get Discounted price based on retailer price and apply current available built-in promotions
        /// </summary>
        /// <param name="contentLink"></param>
        /// <param name="market"></param>
        /// <param name="currency"></param>
        /// <returns></returns>
        protected virtual IEnumerable<DiscountedEntry> GetDiscountedPrices(ContentReference contentLink, IMarket market, Currency currency)
        {
            return _promotionEngine.GetDiscountPrices(new[] { contentLink }, market, currency, _referenceConverter, _lineItemCalculator);
        }
        ///// <summary>
        ///// Get Discounted price based on retailer price and apply current available built-in promotions and coupon codes
        ///// </summary>
        ///// <param name="lineItems"></param>
        ///// <param name="marketId"></param>
        ///// <param name="currency"></param>
        ///// <param name="couponCodes"></param>
        ///// <returns></returns>
        //public List<LineItemRewardDescription> GetDiscountedPrice(ILineItem[] lineItems, MarketId marketId, Currency currency, string[] couponCodes)
        //{
        //    var market = new MarketImpl(marketId);
        //    market.DefaultCurrency = currency;
        //    List<LineItemRewardDescription> lineItemRewards = new List<LineItemRewardDescription>();
        //    //inMemoryOrderGroup.CustomerId
        //    foreach (var item in lineItems)
        //    {
        //        var inMemoryOrderGroup = new InMemoryOrderGroup(market, currency);
        //        inMemoryOrderGroup.AddLineItem(item);
        //        var rewards = _promotionEngine.Run(inMemoryOrderGroup).Where(p => p.Promotion.IsActive).ToList();
        //        if (rewards.Any())
        //        {
        //            var lineItemReward = new LineItemRewardDescription();
        //            lineItemReward.RewardDetails = rewards.Select(x => new RewardDetail
        //            {
        //                AppliedCoupon = x.AppliedCoupon,
        //                SavedAmount = x.SavedAmount,
        //                Description = x.Description
        //            }).ToArray();
        //            lineItemReward.SavedAmount = rewards.Sum(x => x.SavedAmount);
        //            lineItemReward.LineItem = item;
        //            lineItemRewards.Add(lineItemReward);
        //        }

        //    }

        //    return lineItemRewards;
        //}
        /// <summary>
        /// Get Discounted price based on retailer price and apply current available built-in promotions and coupon codes
        /// </summary>
        /// <param name="variantions"></param>
        /// <param name="marketId"></param>
        /// <param name="currency"></param>
        /// <param name="couponCodes"></param>
        /// <param name="placedPrice"></param>
        /// <param name="quantity"></param>
        /// <returns></returns>
        public List<LineItemRewardDescription> GetDiscountedPrice(VariationContent[] variantions, IMarket market, Currency currency, string[] couponCodes = null, decimal placedPrice = 0, int quantity = 1)
        {
            //var market = new MarketImpl(marketId);
            //market.DefaultCurrency = currency;
            List<LineItemRewardDescription> lineItemRewards = new List<LineItemRewardDescription>();

            var promotionEngineSetting = new PromotionEngineSettings()
            {
                ApplyReward = true,
                RequestedStatuses = RequestFulfillmentStatus.Fulfilled
            };


            //inMemoryOrderGroup.CustomerId
            foreach (var item in variantions)
            {
                //var inMemoryOrderGroup = new InMemoryOrderGroup(market, currency);
                var inMemoryOrderGroup = _promotionEngineContentLoader.CreateInMemoryOrderGroup(item.ContentLink, market, currency);
                var lineItem = inMemoryOrderGroup.CreateLineItem(item.Code);
                //This is retailer price without promotion
                var retailPrice = placedPrice == 0 ? GetPrice(item.Code, market.MarketId, currency).UnitPrice.Amount : placedPrice;

                lineItem.PlacedPrice = retailPrice;
                lineItem.Quantity = quantity;

                inMemoryOrderGroup.AddLineItem(lineItem);

                if (couponCodes != null && couponCodes.Any())
                {
                    foreach (var coupon in couponCodes)
                    {
                        inMemoryOrderGroup.GetFirstForm().CouponCodes.Add(coupon);
                    }
                }

                var rewards = _promotionEngine.Run(inMemoryOrderGroup, promotionEngineSetting).Where(p => p.Promotion.IsActive).ToList();
                if (rewards.Any())
                {
                    var lineItemReward = new LineItemRewardDescription();
                    lineItemReward.RewardDetails = rewards.Select(x => new RewardDetail
                    {
                        AppliedCoupon = x.AppliedCoupon,
                        SavedAmount = x.SavedAmount,
                        Description = x.Description
                    }).ToArray();

                    lineItemReward.SavedAmount = rewards.Sum(x => x.SavedAmount);
                    lineItemReward.LineItem = lineItem;
                    lineItemReward.DiscountedAmount = retailPrice - lineItemReward.SavedAmount;
                    lineItemRewards.Add(lineItemReward);
                }
            }

            return lineItemRewards;
        }
    }

}
