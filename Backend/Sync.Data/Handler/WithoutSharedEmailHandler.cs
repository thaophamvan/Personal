using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using System;
using System.Collections.Generic;

public class WithoutSharedEmailHandler : Handler<LifestyleMemberProfile, List<string>>
{
    public override HandleResult<LifestyleMemberProfile> Handle(LifestyleMemberProfile memberProfile, List<string> sharedEmails)
    {
        // Data validation
        Validate(memberProfile);
        if (!sharedEmails.Contains(memberProfile.Email))
        {
            return new HandleResult<LifestyleMemberProfile>(memberProfile, isValidEmail: IsValidEmail(memberProfile.Email));
        }
        else
        {
            return base.Handle(memberProfile, sharedEmails);
        }
    }
    private void Validate(LifestyleMemberProfile memberProfiles)
    {
        memberProfiles.Birthday = GetSafeDate(memberProfiles.Birthday);
        foreach(var item in memberProfiles.MemberWarranties)
        {
            //item.BirthDate = GetSafeDate(item.BirthDate);
            item.ProdRegDate = GetSafeDate(item.ProdRegDate);
            item.PurcDate = GetSafeDate(item.PurcDate);
        }
        foreach (var item in memberProfiles.MemberWarrantyBigs)
        {
            //item.BirthDate = GetSafeDate(item.BirthDate);
            item.ProdRegDate = GetSafeDate(item.ProdRegDate);
            item.PurcDate = GetSafeDate(item.PurcDate);
        }
    }
}