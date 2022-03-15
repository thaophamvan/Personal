using System;

namespace PI.Configuration.Infrastructure
{
    public class SiteSettings : SiteSettingsBase
    {
       
        #region singleton instance

        private static readonly SiteSettings SingletonInstance = new SiteSettings();

        static SiteSettings()
        {
        }

        private SiteSettings()
        {
        }
        public static SiteSettings Instance
        {
            get { return SingletonInstance;}
        }

        #endregion

       
        //public Uri SiteUrl
        //{
        //    get { return Httpcontext; }
        //}

    

        protected int GetApplicationSetting(string key, int @default)
        {
            int num;
            if (!int.TryParse(GetApplicationSetting(key, string.Empty), out num))
            {
                return @default;
            }

            return num;
        }

        protected bool GetApplicationSetting(string key, bool @default)
        {
            bool value;
            if (!bool.TryParse(GetApplicationSetting(key, string.Empty), out value))
            {
                return @default;
            }

            return value;
        }
        /// <summary>
        /// 
        /// </summary>
        /// <param name="key"></param>
        /// <param name="default"></param>
        /// <returns></returns>
        protected TimeSpan GetApplicationSetting(string key, TimeSpan @default)
        {
            TimeSpan value;
            if (!TimeSpan.TryParse(GetApplicationSetting(key, string.Empty), out value))
            {
                return @default;
            }

            return value;
        }
    }
}
