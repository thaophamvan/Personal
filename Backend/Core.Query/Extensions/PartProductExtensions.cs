using Core.Querying.Find.Extensions.Content;
using Platform.Models.Commerce.V3;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using EPiServer.Commerce.Catalog.ContentTypes;
using Mediachase.Commerce;

namespace Core.Querying.Extensions
{
    public static class PartProductExtensions
    {
        public static List<MarketContent> GetModelCategoryNames(this PartProduct part)
        {
            return part.ModelPageList != null ?
                part.ModelPageList.Where(x => x.VisibleInMenu).Select(x => new MarketContent { MarketId = x.MarketId, Content = x.ModelCategoryName }).Distinct().ToList() :
                new MarketContent[0].ToList();
        }

        public static List<MarketContent> GetPartCategoryNamesByMarket(this PartProduct part)
        {
            var partCategories = part.DisplayableCategories();
            List<MarketContent> marketContents = new List<MarketContent>();
            if (partCategories == null || partCategories.Length == 0)
            {
                return marketContents;
            }

            foreach (var partCategory in partCategories)
            {
                if (partCategory.ModelPartPageList != null && partCategory.ModelPartPageList.Any())
                {
                    marketContents.AddRange(partCategory.ModelPartPageList.Where(x => x.VisibleInMenu).Select(x => new MarketContent { MarketId = x.MarketId, Content = partCategory.DisplayName }));
                }
            }

            return marketContents;
        }

        /// <summary>
        /// Return value of DisplayName if it has, otherwise return value of Name.
        /// </summary>
        /// <param name="part"></param>
        /// <returns></returns>
        public static string GetDisplayName(this EntryContentBase part)
        {
            if (string.IsNullOrWhiteSpace(part.DisplayName))
            {
                return part.Name;
            }

            return part.DisplayName;
        }


        /// <summary>
        /// Is TRUE if all items in ModelNumberListLinks IsVirtual and no item in ModelPageList VisibleInMenu
        /// </summary>
        /// <param name="part"></param>
        /// <returns></returns>
        public static bool IsVirtualPart(this PartProduct x)
        {
            return x.ModelNumberListLinks != null && x.ModelNumberListLinks.All(p => p.IsVirtual) &&
                   x.ModelPageList != null && x.ModelPageList.All(p => !p.VisibleInMenu);
        }

        /// <summary>
        /// Is TRUE of the part is virtual in the given market. Note that a part can be a virtual in a market but not in the other if the page link of the other market can be shown in the menu.
        /// </summary>
        /// <param name="p"></param>
        /// <param name="marketId"></param>
        /// <returns></returns>
        public static bool IsVirtualPartInMarket(this PartProduct p, string marketId)
        {
            return p.ModelPageList != null &&
                p.ModelPageList.Any(x => x.MarketId.Equals(marketId, StringComparison.InvariantCultureIgnoreCase) && !x.VisibleInMenu) &&
                p.HasAnyValidPrice(new[] { new MarketId(marketId) });

            //return x.ModelNumberListLinks != null && x.ModelNumberListLinks.All(p => p.IsVirtual) &&
            //       x.ModelPageList != null && x.ModelPageList.All(p => !p.VisibleInMenu);
        }
        public static bool IsDisplayablePartInMarket(this PartProduct p, string marketId)
        {
            return p.ModelPageList != null &&
                p.ModelPageList.Any(x => x.MarketId.Equals(marketId, StringComparison.InvariantCultureIgnoreCase) && !x.VisibleInMenu) &&
                p.HasAnyValidPrice(new[] { new MarketId(marketId) });

            //return x.ModelNumberListLinks != null && x.ModelNumberListLinks.All(p => p.IsVirtual) &&
            //       x.ModelPageList != null && x.ModelPageList.All(p => !p.VisibleInMenu);
        }

        /// <summary>
        /// Is TRUE if ModelPageList is empty OR all items ModelPageList doesn't have url
        /// </summary>
        /// <param name="part"></param>
        /// <returns></returns>
        public static bool IsOrphanPart(this PartProduct x)
        {
            return x.ModelPageList == null || !x.ModelPageList.Any() || x.ModelPageList.All(p => string.IsNullOrWhiteSpace(p.Url));
        }

        /// <summary>
        /// Return true if stop publish <= utcnow
        /// </summary>
        /// <param name="part"></param>
        /// <returns></returns>
        public static bool IsStopped(this EntryContentBase part)
        {
            return part.StopPublish.HasValue && part.StopPublish.Value <= DateTime.UtcNow;
        }
    }
}
