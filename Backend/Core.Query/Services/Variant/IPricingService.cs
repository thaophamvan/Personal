using Platform.Models.Commerce.V3;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Commerce.Order;
using EPiServer.Core;
using Mediachase.Commerce;
using Mediachase.Commerce.Pricing;
using System.Collections.Generic;

namespace Core.Querying.Services
{
    public interface IPricingService
    {
        /// <summary>
        /// Get Retailer price without promotion
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        IPriceValue GetPrice(string code);
        /// <summary>
        /// Get Retailer price without promotion
        /// </summary>
        /// <param name="code"></param>
        /// <param name="marketId"></param>
        /// <param name="currency"></param>
        /// <returns></returns>
        IPriceValue GetPrice(string code, MarketId marketId, Currency currency);
        IPriceValue GetDefaultPrice(string code);
        /// <summary>
        /// Get Discounted price based on retailer price and apply current available built-in promotions
        /// </summary>
        /// <param name="code"></param>
        /// <returns></returns>
        IPriceValue GetDiscountedPrice(string code);

        Money GetMoney(decimal amount);
        /// <summary>
        /// Get Discounted price based on retailer price and apply current available built-in promotions
        /// </summary>
        /// <param name="lineItem"></param>
        /// <param name="currency"></param>
        /// <returns></returns>
        Money GetDiscountedPrice(ILineItem lineItem, Currency currency);
        Money GetVariantPrice(PlatformProduct product);
        ///// <summary>
        ///// Get Discounted price based on retailer price and apply current available built-in promotions and coupon codes
        ///// </summary>
        ///// <param name="lineItem"></param>
        ///// <param name="currency"></param>
        ///// <param name="couponCodes"></param>
        ///// <returns></returns>
        //List<LineItemRewardDescription> GetDiscountedPrice(ILineItem[] lineItems, MarketId marketId, Currency currency, string[] couponCodes);
        /// <summary>
        /// Get Discounted price based on retailer price and apply current available built-in promotions and coupon codes
        /// </summary>
        /// <param name="variantions"></param>
        /// <param name="marketId"></param>
        /// <param name="currency"></param>
        /// <param name="couponCodes">Nullable</param>
        /// <param name="placedPrice">Default is 0. If price is zero then automatically take first AllCustomers price from prices of variant</param>
        /// <param name="quantity">Dfault is 1 qty</param>
        /// <returns></returns>
        List<LineItemRewardDescription> GetDiscountedPrice(VariationContent[] variantions, IMarket marketId, Currency currency, string[] couponCodes = null, decimal placedPrice = 0, int quantity = 1);
    }

    public class LineItemRewardDescription
    {
        //
        // Summary:
        //     Gets total saved amount
        public decimal SavedAmount { get; set; }
        //
        // Summary:
        //     Gets the amount of discounted money this reward has given the order.
        public decimal DiscountedAmount { get; set; }
        //
        // Summary:
        //     Gets or sets rewards that lineitem retreived.
        public RewardDetail[] RewardDetails { get; set; }

        public ILineItem LineItem { get; set; }
    }

    public class RewardDetail
    {
        public string AppliedCoupon { get; set; }
        public decimal SavedAmount { get; set; }
        public decimal Percentage { get; }
        public string Description { get; set; }
        public decimal UnitDiscount { get; }
    }
}
