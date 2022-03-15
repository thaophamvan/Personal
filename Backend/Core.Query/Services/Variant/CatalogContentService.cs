using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using EPiServer;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Commerce.Catalog.Linking;
using EPiServer.Core;
using EPiServer.Filters;
using EPiServer.Globalization;
using EPiServer.ServiceLocation;
using Mediachase.Commerce;
using Mediachase.Commerce.Catalog.Objects;

namespace Core.Querying.Services
{
    [ServiceConfiguration(typeof(CatalogContentService), Lifecycle = ServiceInstanceScope.Singleton)]
    public class CatalogContentService
    {
        private readonly IContentLoader _contentLoader;
        private readonly IRelationRepository _relationRepository;
        private readonly ICurrentMarket _currentMarket;
        private readonly FilterPublished _filterPublished;
        private readonly LanguageResolver _languageResolver;
        private readonly Mediachase.Commerce.Catalog.ReferenceConverter _referenceConverter;

        public CatalogContentService(
            IContentLoader contentLoader,
            IRelationRepository relationRepository,
            ICurrentMarket currentMarket,
            FilterPublished filterPublished,
            LanguageResolver languageResolver,
            Mediachase.Commerce.Catalog.ReferenceConverter referenceConverter)
        {
            _contentLoader = contentLoader;
            _relationRepository = relationRepository;
            _currentMarket = currentMarket;
            _filterPublished = filterPublished;
            _languageResolver = languageResolver;
            _referenceConverter = referenceConverter;
        }

        public virtual IEnumerable<T> GetVariants<T>(PackageContent currentContent) where T : VariationContent
        {
            return GetVariants<T>(currentContent.GetEntries(_relationRepository), ContentLanguage.PreferredCulture);
        }

        public virtual IEnumerable<T> GetVariants<T>(BundleContent currentContent) where T : VariationContent
        {
            return GetVariants<T>(currentContent.GetEntries(_relationRepository), _languageResolver.GetPreferredCulture());
        }

        public virtual IEnumerable<T> GetVariants<T>(ProductContent currentContent) where T : VariationContent
        {
            return GetVariants<T>(currentContent.GetVariants(_relationRepository), _languageResolver.GetPreferredCulture());
        }

        public virtual T GetFirstVariant<T>(ProductContent currentContent) where T : VariationContent
        {
            var firstVariantLink = currentContent.GetVariants(_relationRepository).FirstOrDefault();
            return ContentReference.IsNullOrEmpty(firstVariantLink) ? null : _contentLoader.Get<T>(firstVariantLink);
        }

        public virtual IEnumerable<T> GetVariants<T>(IEnumerable<ContentReference> contentLinks, CultureInfo cultureInfo) where T : VariationContent
        {
            return _contentLoader
                .GetItems(contentLinks, new LoaderOptions() { LanguageLoaderOption.FallbackWithMaster() })
                .OfType<T>()
                .Where(v => v.IsAvailableInCurrentMarket(_currentMarket));
        }

        public virtual IEnumerable<T> GetAllVariants<T>(IEnumerable<ProductContent> products, string language) where T : VariationContent
        {
            return products
                .SelectMany(x => _contentLoader.GetItems(x.GetVariants(_relationRepository), CultureInfo.GetCultureInfo(language))
                .OfType<T>());
        }

        public virtual IEnumerable<T> GetAllVariants<T>(ProductContent product, string language) where T : VariationContent
        {
            return _contentLoader
                .GetItems(product.GetVariants(_relationRepository), CultureInfo.GetCultureInfo(language))
                .OfType<T>();
        }

        public virtual IEnumerable<T> GetSiblingVariants<T>(string code) where T : VariationContent
        {
            var productRelations = _relationRepository.GetParents<ProductVariation>(_referenceConverter.GetContentLink(code));
            var siblingsRelations = _relationRepository.GetChildren<ProductVariation>(productRelations.First().Parent);
            return GetVariants<T>(siblingsRelations.Select(x => x.Child), _languageResolver.GetPreferredCulture());
        }

        public virtual T GetParentProduct<T>(EntryContentBase entry, CultureInfo language = null) where T : ProductContent
        {
            return Get<T>(entry.GetParentProducts(_relationRepository).SingleOrDefault(), language);
        }

        public virtual T Get<T>(ContentReference contentLink, CultureInfo language = null) where T : CatalogContentBase
        {
            return _contentLoader.Get<T>(contentLink, language ?? ContentLanguage.PreferredCulture);
        }

        public virtual bool TryGet<T>(string code, string language, out T product) where T : EntryContentBase
        {
            return _contentLoader.TryGet(_referenceConverter.GetContentLink(code), CultureInfo.GetCultureInfo(language), out product);
        }

        public virtual T Get<T>(string code) where T : EntryContentBase
        {
            var contentReference = _referenceConverter.GetContentLink(code);
            if (!ContentReference.IsNullOrEmpty(contentReference))
                return _contentLoader.Get<T>(contentReference, ContentLanguage.PreferredCulture);
            return null;
        }

        public virtual T Get<T>(string code, string language) where T : EntryContentBase
        {
            var contentReference = _referenceConverter.GetContentLink(code);
            if (!ContentReference.IsNullOrEmpty(contentReference))
            {
                _contentLoader.TryGet<T>(contentReference, CultureInfo.GetCultureInfo(language), out T entryContentBase);
                return entryContentBase;
            }
            else
            {
                return null;
            }
        }

        public virtual bool TryGet<T>(string code, out T product) where T : EntryContentBase
        {
            return _contentLoader.TryGet(_referenceConverter.GetContentLink(code), out product);
        }

        public virtual IEnumerable<T> GetItems<T>(IEnumerable<string> codes) where T : EntryContentBase
        {
            return _contentLoader.GetItems(codes.Select(x => _referenceConverter.GetContentLink(x)), ContentLanguage.PreferredCulture).OfType<T>();
        }

        public virtual IEnumerable<ProductContent> GetProducts(EntryContentBase entryContent, string language)
        {
            switch (entryContent.ClassTypeId)
            {
                case EntryType.Package:
                    return _contentLoader.GetItems(((PackageContent)entryContent).GetEntries(), CultureInfo.GetCultureInfo(language)).OfType<ProductContent>();

                case EntryType.Bundle:
                    return _contentLoader.GetItems(((BundleContent)entryContent).GetEntries(), CultureInfo.GetCultureInfo(language)).OfType<ProductContent>();

                case EntryType.Product:
                    return new[] { entryContent as ProductContent };
            }

            return Enumerable.Empty<ProductContent>();
        }

        public virtual string GetTopCategoryName(EntryContentBase content)
        {
            var parent = _contentLoader.Get<CatalogContentBase>(content.ParentLink);
            var catalog = parent as CatalogContent;
            if (catalog != null)
            {
                return catalog.Name;
            }

            var node = parent as NodeContent;
            return node != null ? GetTopCategory(node).DisplayName : String.Empty;
        }

        private NodeContent GetTopCategory(NodeContent node)
        {
            var parentNode = _contentLoader.Get<CatalogContentBase>(node.ParentLink) as NodeContent;
            return parentNode != null ? GetTopCategory(parentNode) : node;
        }

        public virtual T GetVariantByCode<T>(string code) where T : VariationContent
        {
            var variantLink = _referenceConverter.GetContentLink(code);
            if (_contentLoader.TryGet<T>(variantLink, out var variant))
            {
                return variant;
            }

            return null;
        }
    }

}
