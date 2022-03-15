using ThaoPham.Core.Extentions;
using ThaoPham.Core.Helpers;
using ThaoPham.Web.Business.LifeStyles;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using System.Collections.Generic;
using System.Linq;

public class HasSharedEmailHandler : Handler<LifestyleMemberProfile, List<string>>
{
    public override HandleResult<LifestyleMemberProfile> Handle(LifestyleMemberProfile memberProfile, List<string> sharedEmails)
    {
        bool success = true;
        bool noMerge = false;
        var dataMerge = MergeMember(memberProfile, ref success, ref noMerge);
        if (!success)
        {
            //save failed to retry later
            return base.Handle(memberProfile, sharedEmails);
        }
        if(noMerge)
        {
            return new HandleResult<LifestyleMemberProfile>(dataMerge, isValidEmail: IsValidEmail(memberProfile.Email), hasSharedEmail: true, noMerge: true);
        }
        return new HandleResult<LifestyleMemberProfile>(dataMerge, isValidEmail: IsValidEmail(memberProfile.Email), hasSharedEmail: true);
    }
    private LifestyleMemberProfile MergeMember(LifestyleMemberProfile memberProfile, ref bool success, ref bool noMerge)
    {
        // Call API to Iterable width email
        var iterableUser = AsyncHelper.RunSync(() => iterableService.GetUserByEmail(memberProfile.Email));
        if(iterableUser.IsException)
        {
            success = false;
        }
        if (!iterableUser.Status || iterableUser.User == null || !iterableUser.User.DataFields.SafeAny())
        {
            // log data invalid not need to merge
            noMerge = true;
        }
        else
        {
            // Start Merge Data
            var iterableDataFields = iterableUser.User.DataFields;

            // Merge MemberWarranties Data
            memberProfile.MemberWarranties = DoMigrateMemberDataField(iterableDataFields, "memberWarranties", memberProfile.MemberWarranties);

            // Merge MemberWarrantyBigs Data
            memberProfile.MemberWarrantyBigs = DoMigrateMemberDataField(iterableDataFields, "memberWarrantyBigs", memberProfile.MemberWarrantyBigs);
        }

        return memberProfile;
    }

    #region Private Methods

    /// <summary>
    /// Keep current Lifestyle Warranties, find new warranties from Iterable then append to list Lifestyle Warranties
    /// </summary>
    /// <param name="iterableDataFields">Source Warranties to merge</param>
    /// <param name="propertyName">json field name e.g memberWarranties or memberWarrantyBigs</param>
    /// <param name="lifestyleWarranties">Destination warranties need to update to Iterable</param>
    private List<LifestyleMemberWarranty> DoMigrateMemberDataField(Dictionary<string, object> iterableDataFields, string propertyName, List<LifestyleMemberWarranty> lifestyleWarranties)
    {
        if (!lifestyleWarranties.SafeAny())
            lifestyleWarranties = new List<LifestyleMemberWarranty>();

        if (iterableDataFields.ContainsKey(propertyName))
        {
            var iterableWarranties = base.ConvertToObject<List<LifestyleMemberWarranty>>(iterableDataFields[propertyName]);
            if (iterableWarranties.SafeAny())
            {
                foreach(var i in iterableWarranties)
                {
                    if (!lifestyleWarranties.Any(x => x.Id == i.Id))
                        lifestyleWarranties.Add(i);
                }
            }
        }
        return lifestyleWarranties;
    }
    private List<LifestyleMemberWarrantyBig> DoMigrateMemberDataField(Dictionary<string, object> iterableDataFields, string propertyName, List<LifestyleMemberWarrantyBig> lifestyleWarranties)
    {
        if (!lifestyleWarranties.SafeAny())
            lifestyleWarranties = new List<LifestyleMemberWarrantyBig>();

        if (iterableDataFields.ContainsKey(propertyName))
        {
            var iterableWarranties = base.ConvertToObject<List<LifestyleMemberWarrantyBig>>(iterableDataFields[propertyName]);
            if (iterableWarranties.SafeAny())
            {
                foreach (var i in iterableWarranties)
                {
                    if (!lifestyleWarranties.Any(x => x.Id == i.Id))
                        lifestyleWarranties.Add(i);
                }
            }
        }
        return lifestyleWarranties;
    }

    #endregion
}