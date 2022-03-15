using System.Collections.Generic;
using System.Linq;
using Core.Querying.ExpressionBuilder.Models.Request;
using Core.Querying.ExpressionBuilder.Models.Response;
using EPiServer.Core;
using EPiServer.Find;
using EPiServer.Find.Api.Facets;

namespace Core.Querying.ExpressionBuilder.Helpers
{
    public static class FacetHelper
    {
        public static List<FacetGroup> ExtractFacet<T>(this IHasFacetResults<T> result, FacetSpecification specification) where T : IContent
        {
            if (specification.Items == null) return null;

            var termFacets = result.ExtractTermsFacetFor(specification.Items.Where(f => f.GetType() == typeof(FacetItem)));
            var dateFacets = result.ExtractRangeDateFacetFor(specification.Items.Where(f => f.GetType() == typeof(DateFacetItem)).OfType<DateFacetItem>());
            var numericFacet = result.ExtractRangeNumericFacetFor(specification.Items.Where(f => f.GetType() == typeof(NumericFacetItem)).OfType<NumericFacetItem>());

            return termFacets.Concat(dateFacets).Concat(numericFacet).ToList();
        }

        public static List<FacetGroup> ExtractTermsFacetFor<T>(this IHasFacetResults<T> result, IEnumerable<FacetItem> facets) where T : IContent
        {
            var groups = new List<FacetGroup>();

            if (result.Facets == null) return groups;

            foreach (var facet in facets)
            {
                var facetResult = result.Facets.FirstOrDefault(f => f.Name == facet.PropertyId) as TermsFacet;
                groups.Add(new FacetGroup
                {
                    GroupName = facet.PropertyId,
                    Items = facetResult.Select(r => new FacetFilter
                    {
                        GroupKey = facet.PropertyId,
                        Key = r.Term,
                        Count = r.Count
                    }).ToList()
                });
            }

            return groups;
        }

        public static List<FacetGroup> ExtractRangeDateFacetFor<T>(this IHasFacetResults<T> result, IEnumerable<DateFacetItem> facets) where T : IContent
        {
            var groups = new List<FacetGroup>();

            if (result.Facets == null) return groups;

            foreach (var facet in facets)
            {
                var facetResult = result.Facets.FirstOrDefault(f => f.Name == facet.PropertyId) as DateRangeFacet;
                groups.Add(new FacetGroup
                {
                    GroupName = facet.PropertyId,
                    Items = facetResult.Select(r => new FacetFilter
                    {
                        Key = $"{r.From} {r.To}",
                        Count = r.TotalCount
                    }).ToList()
                });
            }

            return groups;
        }

        public static List<FacetGroup> ExtractRangeNumericFacetFor<T>(this IHasFacetResults<T> result, IEnumerable<NumericFacetItem> facets) where T : IContent
        {
            var groups = new List<FacetGroup>();
            foreach (var facet in facets)
            {
                var facetResult = result.Facets.FirstOrDefault(f => f.Name == facet.PropertyId) as NumericRangeFacet;
                groups.Add(new FacetGroup
                {
                    GroupName = facet.PropertyId,
                    Items = facetResult.Select(r => new FacetFilter
                    {
                        Key = $"{r.From} {r.To}",
                        Count = r.TotalCount
                    }).ToList()
                });
            }

            return groups;
        }
    }
}
