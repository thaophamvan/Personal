using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using System.Collections.Generic;

public class StoreFailedToRetryHandler : Handler<LifestyleMemberProfile, List<string>>
{
    public override HandleResult<LifestyleMemberProfile> Handle(LifestyleMemberProfile memberProfile, List<string> sharedEmails)
    {   
        //TODO: hung.dang refactor later
        // save to data base
        return new HandleResult<LifestyleMemberProfile>(memberProfile, isError: true);
    }
}