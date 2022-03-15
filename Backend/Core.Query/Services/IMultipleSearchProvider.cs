using System.Collections.Generic;
using Core.Querying.ExpressionBuilder.Interfaces;
using Core.Querying.ExpressionBuilder.Models.Response;
using EPiServer.Core;
using EPiServer.Find;
using EPiServer.Find.UnifiedSearch;

namespace Core.Querying.Services
{
    public interface IMultipleSearchProvider
    {
        SearchResponse<TContent> GenericSearch<TContent>(ISearchRequest request) where TContent : IContent;

        SearchResponse<TContent> ExecuteSearchGetContentResult<TContent>(ITypeSearch<TContent> search, string cacheKey) where TContent : IContent;
        SearchResponse<TContent> ExecuteSearchGetContentResultWithoutDataCache<TContent>(ITypeSearch<TContent> search) where TContent : IContent;
        SearchResponse<TContent> ExecuteSearchGetResult<TContent>(ITypeSearch<TContent> search, string cacheKey) where TContent : IContent;

        SearchResponse<TContent> ExecuteContentDataSearch<TContent>(ITypeSearch<TContent> search, string cacheKey)
            where TContent : IContentData;
        SearchResults<TContent> ExecuteProjectionsSearch<TContent>(ISearch<TContent> search, string cacheKey);

        UnifiedSearchResults ExecuteUnifiedSearch(ITypeSearch<ISearchContent> search, string cacheKey);

        IEnumerable<SearchResults<TResult>> ExecuteMultiSearch<TResult>(IMultiSearch<TResult> search, string cacheKey);

        SearchResponse<TContent> ExecuteSearchGetContentResult<TContent>(ITypeSearch<TContent> search, string cacheKey, List<string> cacheKeys, List<string> masterKeys, int cacheTimeOutMintes, bool isAbsolute = true) where TContent : IContent;
    }
}
