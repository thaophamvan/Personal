using System;
using System.Web.Mvc;
using Core.Querying.ExpressionBuilder.FacetRegistry;
using Core.Querying.Find.Conventions;
using Core.Querying.Infrastructure.Ioc;
using Core.Querying.Infrastructure.ProtectedCall;
using Core.Querying.Services;
using Core.Querying.Shared;
using EPiServer.Core;
using EPiServer.Find.Commerce;
using EPiServer.Framework;
using EPiServer.Framework.Initialization;
using EPiServer.ServiceLocation;
using StructureMap;

namespace Core.Querying.Infrastructure.Initialization
{
    [InitializableModule]
    public class DependencyResolverInitialization : IConfigurableModule
    {
        public void ConfigureContainer(ServiceConfigurationContext context)
        {
            context.ConfigurationComplete += (o, e) =>
            {
                context.Services.AddTransient<IFacetRegistry, FacetRegistry>();
                context.Services.AddTransient<IContentDataQueryFactory, ContentDataQueryFactory>();
                //context.Services.AddSingleton<IContentDataQueryHandler, ContentDataQueryHandler>();
                context.Services.AddSingleton<ICircuitBreaker, CircuitBreaker>();

                context.Services.AddTransient<IMultipleSearchProvider, MultipleSearchProvider>();
                context.Services.AddTransient<EpiserverFindServices>();
                context.Services.AddTransient<CacheSearchServices>();

                context.Services.AddTransient<Func<ServiceEnum, ISearchServices>>(serviceProvider => key =>
                {
                    switch (key)
                    {
                        case ServiceEnum.Find:
                            return serviceProvider.GetInstance<EpiserverFindServices>();
                        case ServiceEnum.Cache:
                            return serviceProvider.GetInstance<CacheSearchServices>();
                        default:
                            return null;
                    }
                });
            };
        }

        private static void ConfigureContainer(ConfigurationExpression container)
        {

        }

        public void Initialize(InitializationEngine context)
        {
            DependencyResolver.SetResolver(new ServiceLocatorDependencyResolver(context.Locate.Advanced));
        }
        public void Uninitialize(InitializationEngine context)
        {
        }
        public void Preload(string[] parameters)
        {
        }
    }

    [ModuleDependency(typeof(FindCommerceInitializationModule))]
    public class EpiFindCommerceInitializationModule : IConfigurableModule
    {
        public void ConfigureContainer(ServiceConfigurationContext context)
        {
            context.Services.AddSingleton<CatalogContentClientConventions, SiteCatalogContentClientConventions>();
        }
        public void Initialize(InitializationEngine context)
        {
        }
        public void Uninitialize(InitializationEngine context)
        {
        }
    }
}
