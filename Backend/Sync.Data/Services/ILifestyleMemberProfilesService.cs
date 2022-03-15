using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Services
{
    public interface ILifestyleMemberProfilesService
    {
        Task<LifestyleResult<LifestyleMemberProfilesData>> GetListMemberProfiles(IEnumerable<KeyValuePair<string, string>> requestContent, CancellationToken cancellationToken = default);
        Task<LifestyleResult<LifestyleMemberProfilesData>> GetListMenberProfilesByDate(IEnumerable<KeyValuePair<string, string>> requestContent, CancellationToken cancellationToken = default);
        Task<LifestyleResult<LifestyleSharedEmailsData>> GetAllSharedEmails(CancellationToken cancellationToken = default);
    }
}