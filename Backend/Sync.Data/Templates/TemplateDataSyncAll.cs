using ThaoPham.Core.Extentions;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using ThaoPham.Web.Features.Lifestyle.UserMigration.ScheduledJobs;
using Personal.ScheduledJobWithParameters;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Templates
{
    public class TemplateDataSyncAll : TemplateDataSyncBase
    {
        protected override string PerformSync(Func<bool> canDo, Action<string, string> save, LifestyleConfig config)
        {
            if (_sharedEmails == null)
                return "Can't perform due to shared email list is null";
            int pageNumber = config.FromPageNumer;
            int numberItemPerPage = config.NumberItemPerPage;
            int totalSuccess = 0;
            int totalFailed = 0;
            int TotalRecords = 0;
            List<string> sharedEmailList = new List<string>();
            //List<string> invalidEmailList = new List<string>();
            List<string> invalidEmails = new List<string>();
            List<string> errorMergeList = new List<string>();
            string totalPage = config.ToPageNumer > 0 ? config.ToPageNumer + "" : "";
            string erroMessage = "";
            var handler = new WithoutSharedEmailHandler();
            handler.SetNext(new HasSharedEmailHandler())
                .SetNext(new StoreFailedToRetryHandler());
            bool isContinue = true;
            while (canDo.Invoke() && ((config.ToPageNumer <= 0) || (config.ToPageNumer > 0 && pageNumber <= config.ToPageNumer)) && isContinue)
            {
                var postData = new List<KeyValuePair<string, string>>()
                    {
                        new KeyValuePair<string, string>("PageNumber", $"{pageNumber}"),
                        new KeyValuePair<string, string>("NumberItemPerPage", $"{numberItemPerPage}"),
                    };

                var lifestyleMemberProfiles = lifestyleService.GetListMemberProfiles(postData).Result;
                if (lifestyleMemberProfiles.ResultData == null)
                    break;
                if (TotalRecords == 0)
                    TotalRecords = lifestyleMemberProfiles.ResultData.TotalRecords;
                var totalPageNumber = !string.IsNullOrEmpty(totalPage) ? totalPage : (int)Math.Ceiling((double)TotalRecords / numberItemPerPage) + "";

                var importArg = CommerceImportEventArgs.CreateNew($"page {pageNumber} of {totalPageNumber}, total records {TotalRecords}");
                CommercerImportEvents.Instance.OnImporStatusChanged(this, importArg);
                LifestyleMemberProfilesData result;
                if (lifestyleMemberProfiles.TryGetResultData(out result))
                {
                    if (!result.Customers.Any())
                        break;
                    var lifestyleUpdateMembers = new List<LifestyleMemberProfile>();
                    foreach (var customer in result.Customers)
                    {
                        var normalizeResult = handler.Handle(customer, _sharedEmails.Emails?.ToList());
                        if (normalizeResult.IsError)
                        {
                            // stop the job if have an exception
                            erroMessage = $"Exception from iterable: <br>";
                            isContinue = false;
                            break;
                        }
                        if (normalizeResult.ResultData != null)
                            lifestyleUpdateMembers.Add(normalizeResult.ResultData);
                        if (normalizeResult.HasSharedEmail)
                            sharedEmailList.Add(normalizeResult.ResultData.Email);
                        //if (!normalizeResult.IsValidEmail)
                        //{
                        //    invalidEmailList.Add($"{normalizeResult.ResultData.ExternalMemberId}:{normalizeResult.ResultData.Email}");
                        //}
                        if (normalizeResult.NoMerge)
                        {
                            errorMergeList.Add("ExternalMemberId " + normalizeResult.ResultData.ExternalMemberId + " Page: " + pageNumber);
                        }
                    }
                    if (!isContinue)
                        break;
                    // Do update members to Iterable
                    if (lifestyleUpdateMembers.SafeAny())
                    {
                        var resultIterable = DoUpdate(lifestyleUpdateMembers);
                        if (resultIterable.IsException)
                        {
                            // stop the job if have an exception
                            isContinue = false;
                            erroMessage = $"Exception from iterable: {resultIterable.Message} <br>";
                            break;
                        }
                        if (resultIterable.Status)
                        {
                            totalSuccess = totalSuccess + resultIterable.SuccessCount;
                            totalFailed = totalFailed + resultIterable.failCount;
                            invalidEmails.AddRange(resultIterable.invalidEmails);
                            if (resultIterable.failCount > resultIterable.invalidEmails.Count)
                            {
                                erroMessage = $"Invalid emails: {resultIterable.invalidEmails.Count} and {resultIterable.failCount} items failed at page {pageNumber}: {resultIterable.Message} <br>";
                                break;
                            }
                        }
                        else
                        {
                            erroMessage = $"Sync failed at current page {pageNumber}: {resultIterable.Message} <br>";
                            totalFailed = totalFailed + lifestyleUpdateMembers.Count;
                            break;
                            // Save failed
                            //save.Invoke(SyncAllLifestyleDataParamDefinition.LifestylePageNumberFailed, pageNumber.ToString());
                        }
                    }
                }
                else
                {
                    // Save failed
                    //save.Invoke(SyncAllLifestyleDataParamDefinition.LifestylePageNumberFailed, pageNumber.ToString());
                    erroMessage = $"{lifestyleMemberProfiles.ResultData?.Message} {lifestyleMemberProfiles.Error} {lifestyleMemberProfiles.ErrorMessage} <br>";
                    break;
                }
                pageNumber++;
            }
            save.Invoke(SyncAllLifestyleDataParamDefinition.FromPageNumber, (pageNumber > 1 ? pageNumber - 1 : pageNumber).ToString());

            string sameSharedEmail = "";

            foreach (var line in sharedEmailList.GroupBy(info => info)
                        .Select(group => new
                        {
                            Email = group.Key,
                            Count = group.Count()
                        })
                        .OrderByDescending(x => x.Count))
            {
                sameSharedEmail += $"{line.Email}:{line.Count} | ";
            }
            var emailsEmpty = invalidEmails.Where(m => string.IsNullOrWhiteSpace(m)).Count();
            var emailsNotEmpty = invalidEmails.Where(m => !string.IsNullOrWhiteSpace(m)).Count();

            var msg = $"<strong>Page number:</strong> {(pageNumber > 1 ? pageNumber - 1 : pageNumber)}<br><strong>Total successs:</strong> " +
                $"{totalSuccess}<br> <strong>Total failed:</strong> {totalFailed}" +
                $"<br><strong>Invalid email:[empty:{emailsEmpty} | Not empty:{emailsNotEmpty}] {string.Join(" |", emailsNotEmpty)}</strong>" +
                //$"<br><strong>Invalid email check at CRM:[{invalidEmailList.Count}] {string.Join("|", invalidEmailList)}</strong>" +
                $"<br><strong>Same shared email:[{sharedEmailList.Count}] {sameSharedEmail}</strong>" +
                $"<br><strong>Total record: {TotalRecords}</strong>" +
                $"<br><strong>Can't merge:[Total: {errorMergeList.Count}] {string.Join("|", errorMergeList)}</strong>";
            if (string.IsNullOrEmpty(msg))
                return msg;
            else
                return erroMessage + msg;
        }
    }
}