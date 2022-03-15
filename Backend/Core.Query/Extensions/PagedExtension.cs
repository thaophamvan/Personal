using System.Collections.Generic;
using System.Globalization;
using Core.Querying.ExpressionBuilder.Interfaces;
using Core.Querying.ExpressionBuilder.Models.Response;
using EPiServer;
using EPiServer.Core;
using EPiServer.ServiceLocation;

namespace Core.Querying.Extensions
{
    public static class PagedExtension
    {
        public static IPagedList<T> ToPagedList<T>(this IEnumerable<T> subSet, IPagedRequest request, int totalItemCount)
        {
            return new PagedList<T>(subSet, request.PageNumber, request.PageSize, totalItemCount);
        }

        public static IPagedList<T> ToPagedList<T>(this IEnumerable<T> subSet)
        {
            return new PagedList<T>(subSet);
        }
        public static void GetDescendantsOfType<T>(ContentReference contentLink, ICollection<T> descendants, CultureInfo language) where T : class
        {
            var contentRepository = ServiceLocator.Current.GetInstance<IContentRepository>();
            var children = contentRepository.GetChildren<PageData>(contentLink, language);
            foreach (var child in children)
            {
                if (child is T)
                {
                    descendants.Add(child as T);
                }
                GetDescendantsOfType(child.ContentLink, descendants, language);
            }
        }
    }
}