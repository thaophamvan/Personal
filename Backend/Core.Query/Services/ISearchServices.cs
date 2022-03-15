using System;
using System.Collections.Generic;
using Core.Querying.ExpressionBuilder.Interfaces;
using Core.Querying.ExpressionBuilder.Models.Response;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Core;
using EPiServer.Find;
using EPiServer.Find.UnifiedSearch;

namespace Core.Querying.Services
{
    public interface ISearchServices
    {
        SearchResponse<T> GenericSearch<T>(ISearchRequest request) where T: IContent;
        SearchResponse<T> ExecuteSearchGetContentResult<T>(ITypeSearch<T> search) where T : IContent;
        SearchResponse<T> ExecuteSearchGetContentResultLongCache<T>(ITypeSearch<T> search) where T : IContent;
        SearchResponse<T> ExecuteSearchGetResult<T>(ITypeSearch<T> search);
        SearchResponse<T> ExecuteContentDataSearch<T>(ITypeSearch<T> search) where T : IContentData;
        SearchResults<T> ExecuteProjectionsSearch<T>(ISearch<T> search);
        UnifiedSearchResults ExecuteUnifiedSearch(ITypeSearch<ISearchContent> search);
        SearchResponse<T> FreeTextSearch<T>(string query, int maxItemNumber) where T : IContent;
        IEnumerable<SearchResults<T>> ExecuteMultiSearch<T>(IMultiSearch<T> multiSearch);
    }
}
