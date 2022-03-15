using System;
using Core.Querying.Extensions;
using Core.Querying.Find.Extensions.Content;
using Platform.Models.Commerce.V3;
using EPiServer.Commerce.Catalog.ContentTypes;
using EPiServer.Find;
using EPiServer.Find.Cms;
using EPiServer.Find.Cms.Conventions;
using EPiServer.Find.Commerce;
using EPiServer.Find.Framework;

namespace Core.Querying.Find.Conventions
{
    public class SiteCatalogContentClientConventions : CatalogContentClientConventions
    {
        protected override void ApplyProductContentConventions(EPiServer.Find.ClientConventions.TypeConventionBuilder<ProductContent> conventionBuilder)
        {
            base.ApplyProductContentConventions(conventionBuilder);

            conventionBuilder
                .ExcludeField(x => x.Variations())
                .ExcludeField(x => x.VariationContents())
                .ExcludeField(x => x.MarketFilter)
                .ExcludeField(x => x.Associations)
                .ExcludeField(x => x.SeoInformation)
                .ExcludeField(x => x.Categories)
                .ExcludeField(x => x.ParentNodeRelations())
                .ExcludeField(x => x.ParentProducts())
                .ExcludeField(x => x.Markets())
                .ExcludeField(x => x.ParentEntries);
        }

        public override void ApplyConventions(IClientConventions clientConventions)
        {
            try
            {
                base.ApplyConventions(clientConventions);
                // Uncomment line below if we don't index VariationContent
                ContentIndexer.Instance.Conventions.ForInstancesOf<VariationContent>().ShouldIndex(x => false);
                //ContentDataQueryHandler.Instance.Create().Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(x => x.VariationContents());

            }
            catch
            {
            }
        }
    }
}