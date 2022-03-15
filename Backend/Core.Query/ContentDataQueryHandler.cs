using EPiServer.Core;
using EPiServer.Find;
using EPiServer.Find.Framework;
using EPiServer.ServiceLocation;

namespace Core.Querying
{
    /// <summary>
    /// Provides methods to perform queries for pages and counting pages
    /// and caching the result.
    /// </summary>
    public class ContentDataQueryHandler //: IContentDataQueryHandler
    {
        private static readonly ContentDataQueryHandler SingletonInstance = new ContentDataQueryHandler();
        private static readonly IClient Client = SearchClient.Instance;
        //protected IContentDataQueryFactory PageQueryFactory { get; private set; }

        /// <summary>
        /// Initializes a new instance of the <see cref="ContentDataQueryHandler"/> class. 
        /// </summary>
        /// <param name="pageQueryFactory">Page query factory.</param>
        //public ContentDataQueryHandler(IContentDataQueryFactory pageQueryFactory)
        //{
        //    PageQueryFactory = pageQueryFactory;
        //}
        static ContentDataQueryHandler()
        {
        }

        private ContentDataQueryHandler()
        {
        }


        #region Singleton implementation
        /// <summary>
        /// Gets a singleton instance of the class.
        /// </summary>
        /// <value>The singleton instance.</value>
        public static ContentDataQueryHandler Instance
        {
            get { return SingletonInstance; }
        }
        #endregion

        /// <summary>
        /// 
        /// <para>Create search engine.</para>
        /// </summary>

        public IClient Create()
        {
            return Client;
            //return PageQueryFactory.Create(SearchEngineType.EpiserverFind).GetSearchEngine();
        }
    }
}
