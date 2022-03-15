using System.Configuration;

namespace PI.Configuration.Infrastructure
{
    public class AppSettingsProvider : SettingsProviderBase
    {
        public AppSettingsProvider()
            : this("AppSettings.")
        {
        }

        public AppSettingsProvider(string @namespace)
            : base(@namespace)
        {
        }

        public override string GetSetting(string key, string @default)
        {
            return ConfigurationManager.AppSettings[this.GetIdentifier(key)] ?? @default;
        }
    }
}
