using Core.Querying.ExpressionBuilder.Interfaces;
using Core.Querying.ExpressionBuilder.Models.Response;
using Core.Querying.Models;
using EPiServer.Core;
using EPiServer.Find;
using EPiServer.Find.UnifiedSearch;
using System.Collections.Generic;
using System.Linq;

namespace Core.Querying.Services
{
    public class CacheSearchServices : ISearchServices
    {
        public SearchResponse<T> GenericSearch<T>(ISearchRequest request) where T : IContent
        {
            return EmptySearchResultsFactory.CreateSearchResponse<T>();
        }

        public SearchResponse<T> ExecuteSearchGetContentResult<T>(ITypeSearch<T> search) where T : IContent
        {
            return EmptySearchResultsFactory.CreateSearchResponse<T>();
        }
        public SearchResponse<T> ExecuteSearchGetContentResultLongCache<T>(ITypeSearch<T> search) where T : IContent
        {
            return EmptySearchResultsFactory.CreateSearchResponse<T>();
        }

        public SearchResults<T> ExecuteProjectionsSearch<T>(ISearch<T> search)
        {
           return EmptySearchResultsFactory.CreateSearchResults<T>();
        }

        public SearchResponse<T> FreeTextSearch<T>(string query, int maxItemNumber) where T : IContent
        {
            return EmptySearchResultsFactory.CreateSearchResponse<T>();
        }

        public SearchResponse<T> ExecuteContentDataSearch<T>(ITypeSearch<T> search) where T : IContentData
        {
            return EmptySearchResultsFactory.CreateSearchResponse<T>();
        }

        public UnifiedSearchResults ExecuteUnifiedSearch(ITypeSearch<ISearchContent> search)
        {
            return new EmptyUnifiedSearchResults();
        }

        public SearchResponse<T> ExecuteSearchGetResult<T>(ITypeSearch<T> search)
        {
            return EmptySearchResultsFactory.CreateSearchResponse<T>();
        }

        public IEnumerable<SearchResults<T>> ExecuteMultiSearch<T>(IMultiSearch<T> multiSearch)
        {
            return Enumerable.Empty<SearchResults<T>>();
        }
    }
}
