using EPiServer.Core;
using EPiServer.Find;
using EPiServer.Find.Cms;

namespace Core.Querying
{
    public class FilterBase
    {
        protected readonly IClient FindClient = ContentDataQueryHandler.Instance.Create();
        public ITypeSearch<T> ApplyFilterBaseContent<T>(ITypeSearch<T> search) where T : IContent
        {
            return search;//FilterForVisitor();
        }
        public ITypeSearch<T> ApplyFilterBaseContentData<T>(ITypeSearch<T> search) where T : IContentData
        {
            return search;//FilterForVisitor();
        }
    }
}
