using System.Configuration;

namespace PI.Configuration.Infrastructure
{
    public class ConnectionStringsProvider : SettingsProviderBase
    {
        public ConnectionStringsProvider()
            : this("ConnectionStrings.")
        {
        }

        public ConnectionStringsProvider(string @namespace)
            : base(@namespace)
        {
        }

        public override string GetSetting(string key, string @default)
        {
            return ((ConnectionStringSettings)this.GetSetting(key)).ConnectionString;
        }

        public override ConfigurationElement GetSetting(string key)
        {
            ConnectionStringSettings connectionStringSettings = ConfigurationManager.ConnectionStrings[this.GetIdentifier(key)];
            if (connectionStringSettings == null)
                throw new ConfigurationErrorsException(string.Format("Connection string '{0}' not found in config file", (object)this.GetIdentifier(key)));
            else
                return (ConfigurationElement)connectionStringSettings;
        }
    }
}
