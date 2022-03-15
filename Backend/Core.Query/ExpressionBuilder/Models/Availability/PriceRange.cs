using System.Collections.Generic;
using Platform.Models.Commerce.V3;

namespace Core.Querying.ExpressionBuilder.Models.Availability
{
    public class PriceRangeComparer : IEqualityComparer<PriceRange>
    {
        public bool Equals(PriceRange x, PriceRange y)
        {
            return x.MarketId == y.MarketId && x.CurrencyCode == y.CurrencyCode && x.Price == y.Price;
        }

        public int GetHashCode(PriceRange obj)
        {
            return obj.MarketId.GetHashCode() + obj.Price.GetHashCode() + obj.CurrencyCode.GetHashCode();
        }
    }
}