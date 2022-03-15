using System.Collections.Generic;
using Mediachase.Commerce;

namespace Core.Querying.Services
{
    public interface ICurrencyService
    {
        IEnumerable<Currency> GetAvailableCurrencies();
        Currency GetCurrentCurrency();
        bool SetCurrentCurrency(string currencyCode);
    }

}
