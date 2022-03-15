using System;
using System.Collections.Generic;
using System.Linq;
using EPiServer;
using EPiServer.Commerce.Catalog;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Commerce.Catalog.Linking;
using EPiServer.Commerce.SpecializedProperties;
using EPiServer.ServiceLocation;

namespace Core.Querying.Extensions
{
    public static class ProductContentExtensions
    {
        #region Variantion
        public static IEnumerable<VariationContent> VariationContents(this ProductContent productContent)
        {
            return VariationContents(productContent, ServiceLocator.Current.GetInstance<IContentLoader>(), ServiceLocator.Current.GetInstance<IRelationRepository>());
        }

        public static IEnumerable<VariationContent> VariationContents(this ProductContent productContent, IContentLoader contentLoader, IRelationRepository relationRepository)
        {
            return contentLoader.GetItems(productContent.GetVariants(relationRepository), productContent.Language).OfType<VariationContent>();
        }
        #endregion

        #region Platform Product

        public static bool IsProductClearance(this Platform.Models.Commerce.V3.PlatformProduct product)
        {
            if (string.IsNullOrWhiteSpace(product.ProductStatus))
            {
                return false;
            }

            return new[]
                {
                    "Superseded".ToLower(),
                    "Obsolete".ToLower()
                }.Contains(product.ProductStatus.ToLower());
        }

        public static bool IsClearanceStatus(this string statusString)
        {
            if (string.IsNullOrWhiteSpace(statusString))
            {
                return false;
            }

            return new[]
                {
                    "Superseded".ToLower(),
                    "Obsolete".ToLower()
                }.Contains(statusString.ToLower());
        }
        #endregion

        public static string NormalizeUrl(this string url, bool lowerUrl = true)
        {
            if (string.IsNullOrWhiteSpace(url))
            {
                return string.Empty;
            }

            if (lowerUrl)
            {
                url = url.ToLower().Trim();
            }
            
            if (url.IndexOf("https://", StringComparison.InvariantCultureIgnoreCase) >= 0)
            {
                url = url.Replace("https://", "");
                return $"https://{url}";
            }

            if (url.IndexOf("http://", StringComparison.InvariantCultureIgnoreCase) >= 0)
            {
                url = url.Replace("http://", "");
                return $"http://{url}";
            }

            return $"https://{url}";
        }


    }
}