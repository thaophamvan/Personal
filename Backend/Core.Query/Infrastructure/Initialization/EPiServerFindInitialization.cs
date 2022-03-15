using System;
using System.IO;
using System.Linq;
using System.Runtime.Serialization.Formatters.Binary;
using Core.Querying.Services;
using Platform.Models;
using Platform.Models.CMS.Blocks;
using Platform.Models.CMS.Blocks.Banner;
using Platform.Models.CMS.Blocks.Card;
using Platform.Models.CMS.Blocks.Cards;
using Platform.Models.CMS.Blocks.HomePage;
using Platform.Models.CMS.Blocks.MainMenu;
using Platform.Models.CMS.Pages;
using Platform.Models.CMS.Pages.Global;
using Platform.Models.CMS.Pages.SparePart;
using Platform.Models.Commerce.V2;
using Platform.Models.Commerce.V2.Pages;
using Platform.Models.Commerce.V3;
using Platform.Models.Media;
using EPiServer;
using EPiServer.Commerce.Marketing.Promotions;
using EPiServer.Core;
using EPiServer.DataAccess;
using EPiServer.Find;
using EPiServer.Find.ClientConventions;
using EPiServer.Find.Cms;
using EPiServer.Find.Cms.Conventions;
using EPiServer.Find.Tracing;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.Logging;
using EPiServer.Security;
using EPiServer.ServiceLocation;
using Mediachase.Commerce.Engine.Events;
using InitializationModule = EPiServer.Web.InitializationModule;
using Platform.Models.CMS.Blocks.FAQ;
using Core.Querying.Extensions;

namespace Core.Querying.Infrastructure.Initialization
{

    public class TestTraceListener : ITraceListener
    {
        public void Add(ITraceEvent traceEvent)
        {

        }
    }

    [ModuleDependency(typeof(InitializationModule))]
    public class EPiServerFindInitialization : IInitializableModule
    {
        private IContentLoader _contentLoader = null;
        private IContentRepository _contentRepository = null;

        private IProductIndexingService _productIndexingService;

        private ILogger _logger = LogManager.GetLogger(typeof(EPiServerFindInitialization));

        private IClient _client;


        /// <summary>
        /// Initializes this instance.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <remarks>
        /// Gets called as part of the EPiServer Framework initialization sequence. Note that it will be called
        /// only once per AppDomain, unless the method throws an exception. If an exception is thrown, the initialization
        /// method will be called repeadetly for each request reaching the site until the method succeeds.
        /// </remarks>
        public void Initialize(InitializationEngine context)
        {
            _contentLoader = ServiceLocator.Current.GetInstance<IContentLoader>();
            _productIndexingService = ServiceLocator.Current.GetInstance<IProductIndexingService>();
            _contentRepository = ServiceLocator.Current.GetInstance<IContentRepository>();
            _client = ContentDataQueryHandler.Instance.Create();

            _client.Conventions.ForInstancesOf<PlatformProduct>().ExcludeFieldMatching(x => x.HasMemberAttribute.Equals(nameof(PlatformProduct.SeoInformation)));

            var events = context.Locate.ContentEvents();
            events.PublishedContent += Events_PublishedContent;

            //Include images
            ContentIndexer.Instance.Conventions.ForInstancesOf<IContentMedia>().ShouldIndex(ShouldIndexMediaData);

            //Include items
            ContentIndexer.Instance.Conventions.ForInstancesOf<IContentData>().ShouldIndex(ShouldIndexIContentData);

            ContentIndexer.Instance.Conventions.ForInstancesOf<GenericVariation>().ShouldIndex(x => false);
            ContentIndexer.Instance.Conventions.ForInstancesOf<PartVariation>().ShouldIndex(x => false);
            ContentIndexer.Instance.Conventions.ForInstancesOf<DiagramProduct>().ShouldIndex(x => false);
            ContentIndexer.Instance.Conventions.ForInstancesOf<PartProduct>().ShouldIndex(x => false);
            ContentIndexer.Instance.Conventions.ForInstancesOf<PncProduct>().ShouldIndex(x => false);
            ContentIndexer.Instance.Conventions.ForInstancesOf<PartCategory>().ShouldIndex(x => false);
            ContentIndexer.Instance.Conventions.ForInstancesOf<ModelCategory>().ShouldIndex(x => false);
            ContentIndexer.Instance.Conventions.ForInstancesOf<ModelProduct>().ShouldIndex(x => false);

            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.ProductAvailabilities);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.ModelCategoryNames);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.PartCategoryNames);
            //_client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.AccessoryCategoryNames);
            //_client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.SubAccessoryCategoryNames);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.ModelNumbers);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.Pncs);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.Prices);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.CustomerPrices);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.SuitableBrands);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.BulkPriceList);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.PriceCombinations);
            _client.Conventions.NestedConventions.ForInstancesOf<PartProduct>().Add(p => p.AutoDeliveryPlans);
            _client.Conventions.ForInstancesOf<PartProduct>().IncludeField(p => p.PartDetailedDescription.ToInternalString());
            _client.Conventions.ForInstancesOf<PartProduct>().ExcludeField(p => p.VariantsReference);
            _client.Conventions.ForInstancesOf<PartProduct>().ExcludeField(p => p.PartRRPPriceList);
            _client.Conventions.NestedConventions.ForInstancesOf<PartCategory>().Add(x => x.CategoryLinks);
            
            ContentIndexer.Instance.Conventions.ForInstancesOf<StandardPage>().ShouldIndex(GenerateStandardPageTextSearch);

            #region For StaffSales
            ContentIndexer.Instance.Conventions.ForInstancesOf<PlatformProduct>().ShouldIndex(ShouldIndexProduct);
            ContentIndexer.Instance.Conventions.ForInstancesOf<PlatformCategory>().ShouldIndex(ShouldIndexProductCategory);

            _client.Conventions.NestedConventions.ForInstancesOf<PlatformProduct>().Add(p => p.Availability);
            #endregion

        }

        private void Events_PublishedContent(object sender, ContentEventArgs e)
        {

            var saveEvent = e as SaveContentEventArgs;
            if (saveEvent != null)
            {
                if (saveEvent.Action == (EPiServer.DataAccess.SaveAction.ForceCurrentVersion | EPiServer.DataAccess.SaveAction.Publish))
                {
                    return;
                }
            }

            if (e.Content is PlatformCategory)
            {
                if (_contentLoader == null)
                    _contentLoader = ServiceLocator.Current.GetInstance<IContentLoader>();

                _productIndexingService.ReIndexProductCategoryFilter(e.Content as PlatformCategory);
            }
        }

        /// <summary>
        /// Resets the module into an uninitialized state.
        /// </summary>
        /// <param name="context">The context.</param>
        /// <remarks>
        /// <para>
        /// This method is usually not called when running under a web application since the web app may be shut down very
        /// abruptly, but your module should still implement it properly since it will make integration and unit testing
        /// much simpler.
        /// </para>
        /// <para>
        /// Any work done by <see cref="M:EPiServer.Framework.IInitializableModule.Initialize(EPiServer.Framework.Initialization.InitializationEngine)" /> as well as any code executing on <see cref="E:EPiServer.Framework.Initialization.InitializationEngine.InitComplete" /> should be reversed.
        /// </para>
        /// </remarks>
        public void Uninitialize(InitializationEngine context)
        {
            var events = context.Locate.ContentEvents();
            //events.PublishedContent -= Events_PublishedContent;
        }

        protected virtual CatalogKeyEventArgs DeSerialize(byte[] buffer)
        {
            var formatter = new BinaryFormatter();
            var stream = new MemoryStream(buffer);
            return formatter.Deserialize(stream) as CatalogKeyEventArgs;
        }

        private bool ShouldIndexMediaData(IContentMedia item)
        {
            return false;
        }

        private bool GenerateStandardPageTextSearch(StandardPage item)
        {
            try
            {

                if (item is RecipeDetailPage || item is RecipeListingPage || item is MyAccountPage
                    || item is InvoicePage || item is WishlistPage || item is WishlistDetailPage || item is CartPage
                    || item is ProductComparisonPage || item is CheckoutPage || item is OrderConfirmationPage || item is SearchPage || item is SparePartFaqPage)
                    return false;

                _productIndexingService.GenerateStandardPageTextSearch(item);
                if (item is ProductCategoryPage)
                    _productIndexingService.GenerateCategoryPageFilter((ProductCategoryPage)item);
                return true;
            }
            catch (Exception ex)
            {
                _logger.Error($"EPiServerFindInitialization::GenerateStandardPageTextSearch:: Error: ", ex);

                return true;
            }
        }

        private bool ShouldIndexProductCategory(PlatformCategory item)
        {
            if (item == null || Core.Querying.Utilities.ImportJobState.IsImportJobRunning || item.Status != VersionStatus.Published)
                return false;

            return true;
        }

        private bool ShouldIndexProduct(PlatformProduct item)
        {
            //TODO: We will unpublish page instead of remove
            if (item.IsProductClearance() && (item.Availability == null || item.Availability.Sum(e => e.Amount) == 0))
            {
                ContentIndexer.Instance.TryDelete(item, out var result);
                _logger.Error($"ShouldIndexProduct:: INFO removed product {item.ProductCode} from FIND cause it's superseded. Removing result: {result?.FirstOrDefault()?.Ok}");
                return false;
            }

            if (item.Status != VersionStatus.Published || (item.StopPublish.HasValue && item.StopPublish.Value < DateTime.Now.ToUniversalTime()))
            {
                ContentIndexer.Instance.TryDelete(item, out var result);
                return false;
            }


            try
            {
                var staffSalesSiteConfig = SiteSettingsPage.BrandMarketMappings().First(x => Constant.Markets.IsStaffSaleMarket(x.MarketId));
                var siteSettingPage = _contentLoader.Get<SiteSettingsPage>(new ContentReference(staffSalesSiteConfig.SiteSettingPageId));
                if (siteSettingPage != null && !string.IsNullOrWhiteSpace(siteSettingPage.IgnoreBrand))
                {
                    var brands = siteSettingPage.IgnoreBrand.ToLower().Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries);
                    if (brands.Length > 0 && brands.Contains(item.Brand.ToLower()))
                    {
                        ContentIndexer.Instance.TryDelete(item, out var result);
                        return false;
                    }
                }
            }
            catch (Exception e)
            {
                _logger.Error($"ShouldIndexProduct:: ERROR removed product {item.ProductCode} has error cause of: {e.Message}", e);
            }


            if (_client != null)
            {
                try
                {
                    _productIndexingService.UpdateProductInfo(item);
                    var tempData = item.TempData;
                    if (tempData != null && tempData.Price <= 0)
                    {
                        ContentIndexer.Instance.TryDelete(item, out var result);
                        return false;
                    }
                    _client.Index(item);
                }
                catch (Exception ex)
                {
                    _logger.Error($"EPiServerFindInitialization::UpdateProductInfo:: Error: ", ex);

                    if (ex is NullReferenceException)
                    {
                        try
                        {
                            var writeableProduct = item.CreateWritableClone<PlatformProduct>();
                            writeableProduct.MetaDescription = string.IsNullOrWhiteSpace(writeableProduct.MetaDescription) ? writeableProduct.DisplayName : writeableProduct
                                .MetaDescription;
                            _contentRepository.Save(writeableProduct, SaveAction.Publish, AccessLevel.NoAccess);
                            _logger.Information($"EPiServerFindInitialization::UpdateProductInfo:: Tried to publish product again: {item.Code} - {item.Name}");

                            _client.Index(item);
                            return false;
                        }
                        catch (Exception exception)
                        {
                            _logger.Error($"EPiServerFindInitialization::UpdateProductInfo:: Try to publish and index again error: ", exception);
                            return true;
                        }
                    }

                    return true;
                }
            }
            else
            {
                _logger.Error($"EPiServerFindInitialization::UpdateProductInfo:: Error _client = null");
            }

            return false;
        }

        private bool ShouldIndexIContentData(IContentData item)
        {
            if (item is PartVariation)
            {
                return false;
            }

            if (item is ProductCategoryPage && !(item as ProductCategoryPage).VisibleInMenu)
            {
                return false;
            }

            if (item is RecipeDetailPage || item is RecipeListingPage || item is MyAccountPage
                || item is InvoicePage || item is WishlistPage || item is WishlistDetailPage || item is CartPage
                || item is ProductComparisonPage || item is CheckoutPage || item is OrderConfirmationPage || item is SearchPage)
                return false;
            if (item is PdfFile)
                return false;
            if (item is ImageFile)
                return false;
            if (item is VideoFile)
                return false;
            if (item is DefaultMedia)
                return false;

            if (item is ContentAssetFolder)
                return false;
            if (item is YouMayAlsoLikeBlock || item is ImageTextBlock || item is ImageTextLayoutBlock || item is ImageTextVerticalLayoutBlock
                || item is StandardCardBlock || item is StandardCardGroupBlock || item is StandardHeroBannerBlock
                || item is UniversalBannerBlock || item is UniversalBannerItemBlock || item is BrandCardBlock
                || item is ImageTitleCardBlock || item is SocialPlatformBlock || item is HtmlBlock
                || item is SpendAmountGetShippingDiscount || item is BuyQuantityGetSelectedItemsDiscount
                || item is GotYouCoveredItemBlock || item is SpendAmountGetFreeShipping)
                return false;
            if (item is MenuItemBlock || item is MainMenuItemBlock || item is MenuItemColumnBlock
                || item is SpendAmountGetOrderDiscount || item is HomepageBrandContentBlock)
                return false;
            if (item is ContentFolder)
                return false;
            if (item is SparePartFaqGroupBlock)
            {
                return false;
            }
            return true;
        }
    }
}