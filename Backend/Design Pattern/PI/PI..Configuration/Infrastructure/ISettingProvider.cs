using System.Configuration;

namespace PI.Configuration.Infrastructure
{
    public interface ISettingProvider
    {
        string Namespace { get; }

        bool DoesKeyBelongToMyNamespace(string key);

        string GetSetting(string key, string @default);

        ConfigurationElement GetSetting(string key);
    }
}
