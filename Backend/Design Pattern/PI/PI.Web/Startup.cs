using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(PI.Web.Startup))]
namespace PI.Web
{
    public partial class Startup {
        public void Configuration(IAppBuilder app) {
            ConfigureAuth(app);
        }
    }
}
