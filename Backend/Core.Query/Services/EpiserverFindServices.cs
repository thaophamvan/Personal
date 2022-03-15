using System;
using System.Collections.Generic;
using System.Linq;
using Core.Querying.ExpressionBuilder.Generics;
using Core.Querying.ExpressionBuilder.Interfaces;
using Core.Querying.ExpressionBuilder.Models.Response;
using Core.Querying.Extensions;
using Core.Querying.Infrastructure.Configuration;
using EPiServer.Core;
using EPiServer.Find;
using EPiServer.Find.Cms;
using EPiServer.Find.Framework;
using EPiServer.Find.Statistics;
using EPiServer.Find.UnifiedSearch;
using EPiServer.Logging;
using WildCardQueryBuilderExtensions = Core.Querying.ExpressionBuilder.Generics.WildCardQueryBuilderExtensions;

namespace Core.Querying.Services
{
    public class EpiserverFindServices : FilterBase, ISearchServices
    {
        private readonly ILogger _logger = LogManager.GetLogger(typeof(EpiserverFindServices));

        private ITypeSearch<T> CreateBaseContentSearch<T>(ISearchRequest request) where T : IContent
        {
            var typeSearch = (request.Filters?.Language == null)
                ? FindClient.Search<T>()
                : FindClient.Search<T>(request.Filters?.Language);

            var searchTerm = string.IsNullOrEmpty(request.SearchTerm) ? request.FilterSearchTerm : $"{request.SearchTerm} {request.FilterSearchTerm}";

            if (!string.IsNullOrWhiteSpace(searchTerm))
            {
                var queriedSearch = typeSearch.For(searchTerm);

                if (request.SearchTermFields != null)
                {
                    foreach (var current3 in request.SearchTermFields)
                    {
                        queriedSearch =
                            QueryStringSearchExtensions.InField(queriedSearch, current3.Key, current3.Value);
                    }
                }

                queriedSearch = queriedSearch.WithAndAsDefaultOperator();
                queriedSearch = queriedSearch.UsingSynonyms();

                typeSearch = queriedSearch;

                if (request.UseWildCardSearch)
                {
                    foreach (var term in request.SearchTermFields)
                    {
                        typeSearch = WildCardQueryBuilderExtensions.WildCardQuery(typeSearch, request.SearchTerm, term.Key, term.Value);
                    }
                }
            }

            typeSearch = typeSearch.FilterForVisitor().Filter(request)
                .SortBy(request)
                .PagedBy(request)
                .StaticallyCacheFor(TimeSpan.FromMinutes(SiteSettings.Instance.FindCacheTimeoutSeconds));

            return typeSearch;
        }

        public SearchResponse<T> ExecuteSearchGetContentResult<T>(ITypeSearch<T> search) where T : IContent
        {
            var typeSearch = ApplyFilterBaseContent(search);
            var results = typeSearch.GetContentResultSafe(SiteSettings.Instance.FindCacheTimeoutSeconds, false);
            
            var response = new SearchResponse<T>
            {
                Items = results.ToPagedList(),
                TotalMatching = results.TotalMatching,
                Facets = results.Facets,
            };
            return response;
        }

        public SearchResponse<T> ExecuteSearchGetContentResultLongCache<T>(ITypeSearch<T> search) where T : IContent
        {
            var typeSearch = ApplyFilterBaseContent(search);
            var results = typeSearch.GetContentResultSafe(SiteSettings.Instance.FindCacheTimeoutHours, false);
            
            var response = new SearchResponse<T>
            {
                Items = results.ToPagedList(),
                TotalMatching = results.TotalMatching,
                Facets = results.Facets,
            };
            return response;
        }

        public SearchResponse<T> ExecuteSearchGetResult<T>(ITypeSearch<T> search)
        {
            var results = search.UsingAutoBoost().GetResultSafe(SiteSettings.Instance.FindCacheTimeoutSeconds);
            var response = new SearchResponse<T>
            {
                Items = results.ToPagedList(),
                TotalMatching = results.TotalMatching,
                Facets = results.Facets
            };
            return response;
        }

        public SearchResults<T> ExecuteProjectionsSearch<T>(ISearch<T> search)
        {
            var result = search.GetResultSafe();
            return result;
        }

        public SearchResponse<T> ExecuteContentDataSearch<T>(ITypeSearch<T> search) where T : IContentData
        {
            var typeSearch = ApplyFilterBaseContentData(search);
            var results = typeSearch.GetContentResultSafe(SiteSettings.Instance.FindCacheTimeoutSeconds, false);
            var response = new SearchResponse<T>
            {
                Items = results.ToPagedList(),
                TotalMatching = results.TotalMatching,
                Facets = results.Facets
            };
            return response;
        }
        public UnifiedSearchResults ExecuteUnifiedSearch(ITypeSearch<ISearchContent> search)
        {
            var results = search.UsingAutoBoost().GetResultSafe(null);
            return results;
        }

        public SearchResponse<T> FreeTextSearch<T>(string query, int maxItemNumber) where T : IContent
        {
            var search = ContentDataQueryHandler.Instance.Create();
            var typeSearch = search.Search<T>();
            typeSearch = ApplyFilterBaseContent<T>(typeSearch).Take(maxItemNumber);
            var results = typeSearch.For(query).GetContentResultSafe();
            ContentDataQueryHandler.Instance.Create().Statistics().TrackQuery(query);
            return new SearchResponse<T>
            {
                Items = results.ToPagedList(),
                TotalMatching = results.TotalMatching,
                Facets = results.Facets
            };
        }

        public IEnumerable<SearchResults<TResult>> ExecuteMultiSearch<TResult>(IMultiSearch<TResult> multiSearch)
        {
            var result = multiSearch.GetResultSafe();
            return result;
        }

        public SearchResponse<T> GenericSearch<T>(ISearchRequest request) where T : IContent
        {
            throw new NotImplementedException("Not useful");
        }
    }
}
