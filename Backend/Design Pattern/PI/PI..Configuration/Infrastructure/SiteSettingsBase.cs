using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using log4net;
using PI.Common.StringUlti;

namespace PI.Configuration.Infrastructure
{
    public class SiteSettingsBase
    {
        private readonly ILog _log = LogManager.GetLogger(typeof(SiteSettingsBase));
        private readonly List<ISettingProvider> _providers = new List<ISettingProvider>();

        public string SiteRoot { get; set; }

        public void Init()
        {
            this.RegisterProvider((ISettingProvider)new AppSettingsProvider());
            this.RegisterProvider((ISettingProvider)new ConnectionStringsProvider());
        }

        public void RegisterProvider(ISettingProvider provider)
        {
            this.RegisterProvider(provider, true);
        }

        public void RegisterProvider(ISettingProvider provider, bool checkForAmbiguity)
        {
            if (Enumerable.Any<ISettingProvider>((IEnumerable<ISettingProvider>)this._providers, (Func<ISettingProvider, bool>)(p => p.Namespace == provider.Namespace)))
            {
                if (checkForAmbiguity)
                    throw new ConfigurationErrorsException("Provider with this namespace already registered " + provider.Namespace);
                this._log.WarnFormat("Ambigous provider registration. Namespace: {0}. Older implementation discarded.", (object)provider.Namespace);
                this._providers.Remove(Enumerable.First<ISettingProvider>(Enumerable.Where<ISettingProvider>((IEnumerable<ISettingProvider>)this._providers, (Func<ISettingProvider, bool>)(p => p.Namespace == provider.Namespace))));
            }
            this._providers.Add(provider);
        }

        public string GetSetting(string key, string @default)
        {
            ISettingProvider settingProvider = Enumerable.FirstOrDefault<ISettingProvider>((IEnumerable<ISettingProvider>)this._providers, (Func<ISettingProvider, bool>)(p => p.DoesKeyBelongToMyNamespace(key)));
            if (settingProvider != null)
                return settingProvider.GetSetting(key, @default);
            this._log.WarnFormat("Unknown namespace in key: " + key, new object[0]);
            return @default;
        }

        public ConfigurationElement GetSetting(string key)
        {
            ISettingProvider settingProvider = Enumerable.FirstOrDefault<ISettingProvider>((IEnumerable<ISettingProvider>)this._providers, (Func<ISettingProvider, bool>)(p => p.DoesKeyBelongToMyNamespace(key)));
            if (settingProvider != null)
                return settingProvider.GetSetting(key);
            this._log.WarnFormat("Unknown namespace in key: " + key, new object[0]);
            return (ConfigurationElement)null;
        }

        public int GetSetting(string key, int @default)
        {
            int result;
            if (!int.TryParse(this.GetSetting(key, string.Empty), out result))
                return @default;
            else
                return result;
        }

        public ConnectionStringSettings GetConnectionString(string key)
        {
            if (!key.StartsWith("ConnectionStrings."))
                key = string.Format("ConnectionStrings.{0}", (object)key);
            return this.GetSetting(key) as ConnectionStringSettings;
        }

        public string GetApplicationSetting(string key, string @default)
        {
            if (!key.StartsWith("AppSettings."))
                key = string.Format("AppSettings.{0}", (object)key);
            return this.GetSetting(key, @default);
        }

        public List<KeyValuePair<string, string>> GetAppSettingsList(string settingsName)
        {
            List<KeyValuePair<string, string>> list = StringUtility.ToKeyValuePairCollection(this.GetApplicationSetting(settingsName, string.Empty), ';', '|');
            if (list.Count == 0)
                throw new ConfigurationErrorsException(string.Format("{0} expected in configuration", (object)settingsName));
            else
                return list;
        }
    }
}
