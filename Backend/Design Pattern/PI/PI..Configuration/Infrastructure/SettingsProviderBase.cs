using System;
using System.Configuration;

namespace PI.Configuration.Infrastructure
{
    public abstract class SettingsProviderBase : ISettingProvider
    {
        private string @namespace;

        public string Namespace
        {
            get
            {
                return this.@namespace;
            }
        }

        public SettingsProviderBase(string @namespace)
        {
            this.@namespace = @namespace;
        }

        public bool DoesKeyBelongToMyNamespace(string key)
        {
            return key.StartsWith(this.@namespace);
        }

        public abstract string GetSetting(string key, string @default);

        public virtual ConfigurationElement GetSetting(string key)
        {
            throw new NotImplementedException();
        }

        protected string GetIdentifier(string key)
        {
            return key.Replace(this.Namespace, string.Empty);
        }
    }
}
