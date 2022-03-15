using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using Core.Querying.ExpressionBuilder.Interfaces;
using Core.Querying.ExpressionBuilder.Models.Response;
using Core.Querying.Extensions;
using Core.Querying.Infrastructure.Configuration;
using Core.Querying.Infrastructure.ProtectedCall;
using Core.Querying.Models;
using Core.Querying.Shared;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Core;
using EPiServer.Find;
using EPiServer.Find.UnifiedSearch;
using EPiServer.ServiceLocation;

namespace Core.Querying.Services
{
    [ServiceConfiguration(typeof(IMultipleSearchProvider))]
    public class MultipleSearchProvider : ServicesBase, IMultipleSearchProvider
    {
        private readonly ICircuitBreaker _circruiBreaker;
        private readonly Func<ServiceEnum, ISearchServices> _searchServices;

        public MultipleSearchProvider(Func<ServiceEnum, ISearchServices> searchServices, ICircuitBreaker circruiBreaker)
        {
            _searchServices = searchServices;
            _circruiBreaker = circruiBreaker;
        }

        #region Fallback wait and retry circuit breaker

        public SearchResponse<TContent> GenericSearch<TContent>(ISearchRequest request) where TContent : IContent
        {
            var cacheKey = request.GetCacheKey();

            var result = ExecuteAndCache(cacheKey,
                () =>
                {
                    var searchResult = _circruiBreaker.Execute<SearchResponse<TContent>>(
                        () => _searchServices(ServiceEnum.Find).GenericSearch<ProductContent>(request) as SearchResponse<TContent>,
                        () => _searchServices(ServiceEnum.Cache).GenericSearch<ProductContent>(request) as SearchResponse<TContent>
                    );
                    return searchResult;
                },
                EmptySearchResultsFactory.CreateSearchResponse<TContent>(),
                TimeSpan.FromSeconds(SiteSettings.Instance.ExecuteAndCacheTimeoutSeconds),
                "search");
            return result;
        }

        public SearchResponse<TContent> ExecuteSearchGetContentResult<TContent>(ITypeSearch<TContent> search, string cacheKey) where TContent : IContent
        {
            var result = ExecuteAndCache(cacheKey,
                () =>
                {
                    var searchResult = _circruiBreaker.Execute<SearchResponse<TContent>>(
                        () => _searchServices(ServiceEnum.Find).ExecuteSearchGetContentResult<TContent>(search) as SearchResponse<TContent>,
                        () => _searchServices(ServiceEnum.Cache).ExecuteSearchGetContentResult<TContent>(search) as SearchResponse<TContent>
                    );
                    return searchResult;
                },
                EmptySearchResultsFactory.CreateSearchResponse<TContent>(),
                TimeSpan.FromSeconds(SiteSettings.Instance.ExecuteAndCacheTimeoutSeconds),
                "search");
            return result;
        }
        public SearchResponse<TContent> ExecuteSearchGetContentResult<TContent>(ITypeSearch<TContent> search, string cacheKey, List<string> cacheKeys, List<string> masterKeys, int cacheTimeOutMintes, bool isAbsolute = true) where TContent : IContent
        {
            var result = ExecuteAndCache(cacheKey, cacheKeys, masterKeys,
                () =>
                {
                    var searchResult = _circruiBreaker.Execute<SearchResponse<TContent>>(
                        () => _searchServices(ServiceEnum.Find).ExecuteSearchGetContentResult<TContent>(search) as SearchResponse<TContent>,
                        () => _searchServices(ServiceEnum.Cache).ExecuteSearchGetContentResult<TContent>(search) as SearchResponse<TContent>
                    );
                    return searchResult;
                },
                EmptySearchResultsFactory.CreateSearchResponse<TContent>(),
                TimeSpan.FromMinutes(cacheTimeOutMintes),
                "search", isAbsolute);
            return result;
        }

        public SearchResponse<TContent> ExecuteSearchGetContentResultWithoutDataCache<TContent>(ITypeSearch<TContent> search) where TContent : IContent
        {
            var result = ExecuteWithoutCache(
                () =>
                {
                    var searchResult = _circruiBreaker.Execute<SearchResponse<TContent>>(
                        () => _searchServices(ServiceEnum.Find).ExecuteSearchGetContentResultLongCache<TContent>(search) as SearchResponse<TContent>,
                        () => _searchServices(ServiceEnum.Cache).ExecuteSearchGetContentResultLongCache<TContent>(search) as SearchResponse<TContent>
                    );
                    return searchResult;
                },
                EmptySearchResultsFactory.CreateSearchResponse<TContent>());
            return result;
        }

        public SearchResponse<TContent> ExecuteSearchGetResult<TContent>(ITypeSearch<TContent> search, string cacheKey) where TContent : IContent
        {
            var result = ExecuteAndCache(
                GetType().Name + "." + MethodBase.GetCurrentMethod().Name + ":" + cacheKey,
                () =>
                {
                    var searchResult = _circruiBreaker.Execute<SearchResponse<TContent>>(
                        () => _searchServices(ServiceEnum.Find).ExecuteSearchGetResult<TContent>(search) as SearchResponse<TContent>,
                        () => _searchServices(ServiceEnum.Cache).ExecuteSearchGetResult<TContent>(search) as SearchResponse<TContent>
                    );
                    return searchResult;
                },
                EmptySearchResultsFactory.CreateSearchResponse<TContent>(),
                TimeSpan.FromSeconds(SiteSettings.Instance.ExecuteAndCacheTimeoutSeconds),
                "search");
            return result;
        }

        public SearchResults<TContent> ExecuteProjectionsSearch<TContent>(ISearch<TContent> search, string cacheKey)
        {
            
            var result = ExecuteAndCache(cacheKey,
                () =>
                {
                    var searchResult = _circruiBreaker.Execute<SearchResults<TContent>>(
                        () => _searchServices(ServiceEnum.Find).ExecuteProjectionsSearch<TContent>(search) as SearchResults<TContent>,
                        () => _searchServices(ServiceEnum.Cache).ExecuteProjectionsSearch<TContent>(search) as SearchResults<TContent>
                    );
                    return searchResult;
                },
                EmptySearchResultsFactory.CreateSearchResults<TContent>(),
                TimeSpan.FromSeconds(SiteSettings.Instance.ExecuteAndCacheTimeoutSeconds),
                "search");
            return result;
        }

        public UnifiedSearchResults ExecuteUnifiedSearch(ITypeSearch<ISearchContent> search, string cacheKey)
        {
            var result = ExecuteAndCache(cacheKey,
                () =>
                {
                    var searchResult = _circruiBreaker.Execute(
                        () => _searchServices(ServiceEnum.Find).ExecuteUnifiedSearch(search),
                        () => _searchServices(ServiceEnum.Cache).ExecuteUnifiedSearch(search)
                    );
                    return searchResult;
                },
                new EmptyUnifiedSearchResults(),
                TimeSpan.FromSeconds(SiteSettings.Instance.ExecuteAndCacheTimeoutSeconds),
                "search");
            return result;
        }

        public SearchResponse<TContent> ExecuteContentDataSearch<TContent>(ITypeSearch<TContent> search, string cacheKey) where TContent : IContentData
        {
            var result = ExecuteAndCache(cacheKey,
                () =>
                {
                    var searchResult = _circruiBreaker.Execute<SearchResponse<TContent>>(
                        () => _searchServices(ServiceEnum.Find).ExecuteContentDataSearch<TContent>(search) as SearchResponse<TContent>,
                        () => _searchServices(ServiceEnum.Cache).ExecuteContentDataSearch<TContent>(search) as SearchResponse<TContent>
                    );
                    return searchResult;
                },
                EmptySearchResultsFactory.CreateSearchResponse<TContent>(),
                TimeSpan.FromSeconds(SiteSettings.Instance.ExecuteAndCacheTimeoutSeconds),
                "search");
            return result;
        }

        public IEnumerable<SearchResults<TResult>> ExecuteMultiSearch<TResult>(IMultiSearch<TResult> multiSearch, string cacheKey)
        {
            var result = ExecuteAndCache(cacheKey,
                () =>
                {
                    var searchResult = _circruiBreaker.Execute<IEnumerable<SearchResults<TResult>>>(
                        () => _searchServices(ServiceEnum.Find).ExecuteMultiSearch<TResult>(multiSearch) as IEnumerable<SearchResults<TResult>>,
                        () => _searchServices(ServiceEnum.Cache).ExecuteMultiSearch<TResult>(multiSearch) as IEnumerable<SearchResults<TResult>>
                    );
                    return searchResult;
                },
                Enumerable.Empty<SearchResults<TResult>>(),
                TimeSpan.FromSeconds(SiteSettings.Instance.ExecuteAndCacheTimeoutSeconds),
                "search");
            return result;
        }
        #endregion

        #region Wait and retry forever

        public SearchResponse<TContent> ExecuteSearchRetryForever<TContent>(ITypeSearch<TContent> search, string cacheKey) where TContent : IContent
        {
            var result = ExecuteAndCache(cacheKey,
                () =>
                {
                    var searchResult = _circruiBreaker.ExecuteWaitAndRetryForever<SearchResponse<TContent>>(
                        () => _searchServices(ServiceEnum.Find).ExecuteSearchGetContentResult<TContent>(search) as SearchResponse<TContent>
                    );
                    return searchResult;
                },
                EmptySearchResultsFactory.CreateSearchResponse<TContent>(),
                TimeSpan.FromSeconds(SiteSettings.Instance.ExecuteAndCacheTimeoutSeconds),
                "search");
            return result;
        }

     
        #endregion
    }
}
