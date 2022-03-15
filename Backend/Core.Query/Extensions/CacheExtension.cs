using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Cryptography;
using System.Text;
using Core.Querying.ExpressionBuilder.Interfaces;

namespace Core.Querying.Extensions
{
    public static class CacheExtension
    {
        public static string GetCacheKey(this ISearchRequest request)
        {
            var marketId = $"_MarketId-{request.MarketId}";
            var useWildCardSearch = $"_WildCard{request.UseWildCardSearch}";
            var searchTerm = $"_Term-{request.SearchTerm}";
            var filterSearchTerm = $"_filterTerm-{request.FilterSearchTerm}" ;
            var pageNumber =$"_PageNumber-{request.PageNumber}";
            var pageSize = $"_PageSize-{request.PageSize}";
            
            string searchTermFields = "_TermFields";
            if (request.SearchTermFields != null)
            {
                foreach (var pair in request.SearchTermFields)
                {
                    searchTermFields = $"{searchTermFields}-{pair.Key}:{pair.Value}";
                }
            }
            
            var filterSpecificationLanguage = request.Filters.Language?.Name;

            var filterSpecificationITem = "_Filter";
            foreach (var item in request.Filters.Items)
            {
                filterSpecificationITem = $"{filterSpecificationITem}:{item.Connector}:{item.OperationValue}:{item.PropertyId}" +
                                          $":{item.PropertyType.Name}:{string.Join(":", item.Parameters.Select(v => v.Value))}";
            }

            var sorts = "_Sorts";
            foreach (var item in request.Sorts.Items)
            {
                sorts = $"{sorts}-{item.Field}:{item.Ascending}";
            }

            var facet = "_Facet";
            foreach (var item in request.Facets.Items)
            {
                facet = $"{facet}-{item.PropertyId}:{item.PropertyType.Name}:{item.Interval}:{item.OperationValue}";
            }

            var cacheKey = $"{marketId}_{useWildCardSearch}_{searchTerm}_{filterSearchTerm}_{pageNumber}_{pageSize}" +
                           $"_{filterSpecificationLanguage}_{sorts}";
            return cacheKey.Md5Hash();
        }

        private static string Md5Hash(this string input)
        {
            byte[] hash;
            using (MD5 md5 = MD5.Create())
            {
                hash = md5.ComputeHash(Encoding.UTF8.GetBytes(input));
                StringBuilder sb = new StringBuilder();
                for (int i = 0; i < hash.Length; i++)
                {
                    sb.Append(hash[i].ToString("X2"));
                }
                return sb.ToString();
            }
        }

        public static string BuildCacheKey(Dictionary<string, object> nameAndValueOfParameters, string nameOfClass, [CallerMemberName]string nameOfMethod = "")
        {
            var underscore = "_";

            var cacheKeyBuilder = new StringBuilder();

            cacheKeyBuilder.Append(nameOfClass)
                .Append(underscore)
                .Append(nameOfMethod)
                .Append(underscore);

            foreach (var nameAndValueOfParameter in nameAndValueOfParameters)
            {
                cacheKeyBuilder.Append(nameAndValueOfParameter.Key);
                cacheKeyBuilder.Append(underscore);

                if (nameAndValueOfParameter.Value == null)
                {
                    cacheKeyBuilder.Append(string.Empty);
                }
                else
                {
                    cacheKeyBuilder.Append(nameAndValueOfParameter.Value);
                }
            }

            return cacheKeyBuilder.ToString();
        }
    }
}

