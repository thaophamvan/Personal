using System;
using System.Collections.Generic;
using Platform.Models.CMS.Pages;
using Platform.Models.Models.Market;

namespace Core.Querying.Infrastructure.Configuration
{
    public class SiteSettings
    {
        private static readonly Lazy<SiteSettings> SiteSettingsInstance = new Lazy<SiteSettings>(() => new SiteSettings());
        private readonly ISiteSettingsProvider _siteSettingsProvider = new SiteSettingsProvider();
        //private static List<BrandMarketItem> marketBrandList = new List<BrandMarketItem>();
        private SiteSettings()
        {
        }

        public static SiteSettings Instance
        {
            get { return SiteSettingsInstance.Value; }
        }


        public int ExecuteAndCacheTimeoutSeconds
        {
            get { return GetSetting("ExecuteAndCacheTimeOut", 300); }
        }

        public int FindCacheTimeoutMinutes
        {
            get { return GetSetting("FindCacheTimeOutMinutes", 5); }
        }

        public int FindCacheTimeoutSeconds
        {
            get { return GetSetting("FindCacheTimeOutSeconds", 300); }
        }

        public int FindCacheTimeoutHours
        {
            get { return 12; }
        }

        public int ExceptionsAllowedBeforeBreaking
        {
            get { return GetSetting("ExceptionsAllowedBeforeBreaking", 3); }
        }

        public int RetryCount
        {
            get { return GetSetting("RetryCount", 3); }
        }

        public int DurationOfBreakMilliseconds
        {
            get { return GetSetting("DurationOfBreak", 3000); }
        }

        public int SleepDurationsMilliseconds
        {
            get { return GetSetting("SleepDurationsMilliseconds", 300); }
        }

        public bool CacheEnabled
        {
            get
            {
                try
                {
                    var setting = GetSetting("CacheEnabled", "true").ToLower();
                    return bool.Parse(setting);
                }
                catch
                {
                    return false;
                }
            }
        }

        private TimeSpan GetSetting(string key, TimeSpan defaultValue)
        {
            TimeSpan result;
            var setting = GetSetting(key, string.Empty);

            return TimeSpan.TryParse(setting, out result) ? result : defaultValue;
        }

        private string GetSetting(string key, string defaultValue)
        {
            return _siteSettingsProvider.GetSetting(key, defaultValue);
        }

        private int GetSetting(string key, int defaultValue)
        {
            int result;
            var setting = GetSetting(key, string.Empty);

            return int.TryParse(setting, out result) ? result : defaultValue;
        }

        private bool GetSetting(string key, bool defaultValue)
        {
            bool result;
            var setting = GetSetting(key, string.Empty);

            return bool.TryParse(setting, out result) ? result : defaultValue;
        }

        private object GetSetting(string key)
        {
            return _siteSettingsProvider.GetSetting(key);
        }

        public List<BrandMarketMapping> GetBrandMarketMapping()
        {
            return SiteSettingsPage.BrandMarketMappings();
        }
    }
}
