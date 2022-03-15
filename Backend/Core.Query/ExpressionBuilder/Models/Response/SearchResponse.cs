using EPiServer.Find.Api;
using System.Collections.Generic;

namespace Core.Querying.ExpressionBuilder.Models.Response
{
    public class SearchResponse<T>
    {
        public IPagedList<T> Items { get; set; }
        public FacetResults Facets { get; set; }
        public int TotalMatching { get; set; }
    }
}