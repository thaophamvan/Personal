using EPiServer.ServiceLocation;
using Mediachase.Commerce;
using Mediachase.Commerce.Pricing;

namespace Core.Querying.Services
{
    public static class PriceFilterHelper
    {
        public static PriceFilter BuildPriceFilter(Currency currency)
        {
            if (ServiceLocator.Current.GetInstance<CustomerContextFacade>().CurrentContact.CurrentContact == null)
            {
                return new PriceFilter
                {
                    Currencies = new[] { currency },
                    CustomerPricing = new CustomerPricing[] { CustomerPricing.AllCustomers, }
                };
            }

            return new PriceFilter
            {
                Currencies = new[] { currency },
                CustomerPricing = new CustomerPricing[] { new CustomerPricing((CustomerPricing.PriceType)3, string.Empty) }
            };
        }
    }

}
