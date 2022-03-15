using ThaoPham.Core.Extentions;
using ThaoPham.Web.Features.Lifestyle.UserMigration.Models;
using ThaoPham.Web.Features.Lifestyle.UserMigration.ScheduledJobs;
using Personal.ScheduledJobWithParameters;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace ThaoPham.Web.Features.Lifestyle.UserMigration.Templates
{
    public class TemplateDataSyncNew : TemplateDataSyncBase
    {
        string dateFormat = "yyyy-MM-dd HH:mm:ss";
        protected override string PerformSync(Func<bool> canDo, Action<string, string> save, LifestyleConfig config)
        {
            var queryFromDate = GetQueryFromDate(config.FromDate, config.LastUpdate);
            var queryToDate = GetQueryToDate(config.ToDate);
            int TotalRecords = 0;
            int totalSuccess = 0;
            int totalFailed = 0;
            int pageNumber = 1;
            int numberItemPerPage = 10;
            string erroMessage = "";
            bool isSuccess = true;
            List<string> invalidEmails = new List<string>();
            List<string> sharedEmailList = new List<string>();
            //List<string> invalidEmailList = new List<string>();
            List<string> errorMergeList = new List<string>();

            var handler = new WithoutSharedEmailHandler();
            handler.SetNext(new HasSharedEmailHandler())
                .SetNext(new StoreFailedToRetryHandler());
            if (string.IsNullOrEmpty(queryFromDate) || string.IsNullOrEmpty(queryToDate))
            {
                return "Query date is not correct format";
            }
            while (canDo.Invoke() && isSuccess)
            {
                var postData = new List<KeyValuePair<string, string>>()
                    {
                        new KeyValuePair<string, string>("FromDate", queryFromDate),
                        new KeyValuePair<string, string>("PageNumber", $"{pageNumber}"),
                        new KeyValuePair<string, string>("NumberItemPerPage", $"{numberItemPerPage}"),
                        new KeyValuePair<string, string>("ToDate", $"{queryToDate}"),
                    };

                var lifestyleMemberProfiles = lifestyleService.GetListMenberProfilesByDate(postData).Result;

                if (lifestyleMemberProfiles.ResultData == null)
                    break;
                if (TotalRecords == 0)
                    TotalRecords = lifestyleMemberProfiles.ResultData.TotalRecords;
                var totalPageNumber = (int)Math.Ceiling((double)TotalRecords / numberItemPerPage);

                var importArg = CommerceImportEventArgs.CreateNew($"Sync at date {queryFromDate} - page {pageNumber} of {totalPageNumber}, total records {TotalRecords}");
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
                            erroMessage = $"Exception from iterable <br>";
                            isSuccess = false;
                            break;
                        }
                        if (normalizeResult.ResultData != null)
                            lifestyleUpdateMembers.Add(normalizeResult.ResultData);
                        if (normalizeResult.HasSharedEmail)
                            sharedEmailList.Add(normalizeResult.ResultData.Email);
                        if (normalizeResult.NoMerge)
                        {
                            errorMergeList.Add("ExternalMemberId " + normalizeResult.ResultData.ExternalMemberId + " Page: " + pageNumber);
                        }
                    }
                    if (!isSuccess)
                        break;
                    // Do update members to Iterable
                    if (lifestyleUpdateMembers.SafeAny())
                    {
                        var resultIterable = DoUpdate(lifestyleUpdateMembers);
                        if (resultIterable.IsException)
                        {
                            // stop the job if have an exception
                            isSuccess = false;
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
                            //save.Invoke(SyncAllLifestyleDataParamDefinition.LifestylePageNumberFailed + "JobNew", pageNumber.ToString());
                        }
                    }
                }
                else
                {
                    isSuccess = false;
                    // Save failed
                    //save.Invoke(SyncAllLifestyleDataParamDefinition.LifestylePageNumberFailed + "JobNew", pageNumber.ToString());
                    erroMessage = $"{lifestyleMemberProfiles.ResultData?.Message} {lifestyleMemberProfiles.Error} {lifestyleMemberProfiles.ErrorMessage} <br>";
                    break;
                }
                pageNumber++;
            }

            if (isSuccess)
                save.Invoke(SyncNewLifestyleDataParamDefinition.LifestyleLastSyncDate, queryToDate);

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
                $"<br><strong>Total records: {TotalRecords}" +
                $"<br><strong>can't merge:[Total: {errorMergeList.Count}] {string.Join("|", errorMergeList)}</strong>";
            if (string.IsNullOrEmpty(msg))
                return msg;
            else
                return erroMessage + msg;

        }
        private string GetQueryFromDate(string fromDate, string lasSyncDate)
        {
            DateTime d;
            if (!string.IsNullOrEmpty(fromDate))
            {
                bool chValidity = DateTime.TryParseExact(
                fromDate,
                dateFormat,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out d);
                if (chValidity)
                    return fromDate;
                else
                    return null;
            }
            else if (!string.IsNullOrEmpty(lasSyncDate))
            {
                bool chValidity = DateTime.TryParseExact(
                   lasSyncDate,
                   dateFormat,
                   CultureInfo.InvariantCulture,
                   DateTimeStyles.None,
                   out d);
                if (chValidity)
                    return lasSyncDate;
            }
            return DateTime.UtcNow.AddDays(-1).ToString(dateFormat);
        }
        private string GetQueryToDate(string toDate)
        {
            DateTime d;
            if (!string.IsNullOrEmpty(toDate))
            {
                bool chValidity = DateTime.TryParseExact(
                toDate,
                dateFormat,
                CultureInfo.InvariantCulture,
                DateTimeStyles.None,
                out d);
                if (chValidity)
                    return toDate;
                else
                    return null;
            }
            return DateTime.UtcNow.ToString(dateFormat);
        }
    }
}