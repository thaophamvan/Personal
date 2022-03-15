using System.Collections.Generic;
using System.Text.RegularExpressions;
using System.Web;
using PI.Common.ExceptionHandle;
using System.Linq;
using System.Text;

namespace PI.Common.StringUlti
{
    public static class StringUtility
    {
        public static string StripMaliciousHtml(this string value)
        {
            if (string.IsNullOrEmpty(value))
                return value;
            else
                return Regex.Replace(value, "</?(?i:script|applet|embed|object|body|frame|iframe|frameset|meta|link|html|img|style|layer|table|ilayer)(.|\n)*?>", string.Empty);
        }

        public static string StripAllHtml(this string value)
        {
            if (string.IsNullOrEmpty(value))
                return value;
            else
                return Regex.Replace(value, "</?\\w+((\\s+\\w+(\\s*=\\s*(?:\".*?\"|'.*?'|[^'\">\\s]+))?)+\\s*|\\s*)/?>", string.Empty);
        }

        public static string HtmlEscape(this string text)
        {
            if (string.IsNullOrEmpty(text))
                return text;
            else
                return HttpUtility.HtmlEncode(text).Replace("'", "&#39;");
        }

     

        public static List<KeyValuePair<string, string>> ToKeyValuePairCollection(this string value, char pairSeparator, char listElementSeparator)
        {
            List<KeyValuePair<string, string>> list = new List<KeyValuePair<string, string>>();
            if (!string.IsNullOrEmpty(value))
            {
                string str1 = value;
                char[] chArray1 = new char[1]
        {
          listElementSeparator
        };
                foreach (string str2 in str1.Split(chArray1))
                {
                    char[] chArray2 = new char[1]
          {
            pairSeparator
          };
                    string[] strArray = str2.Split(chArray2);
                    if (strArray.Length != 2)
                        throw new InvalidFormatException("String representation of object must contains two elements.");
                    list.Add(new KeyValuePair<string, string>(strArray[0], strArray[1]));
                }
            }
            return list;
        }

        public static string InsertBreak(string text, int insertionPos)
        {
            if (text.Length - insertionPos >= 3)
                return text.Insert(insertionPos, "-<br/>");
            insertionPos -= 3 - (text.Length - insertionPos);
            return text.Insert(insertionPos, "-<br/>");
        }
        /// <summary>
        /// Converts an integer into a roman numeral.
        /// </summary>
        /// <param name="number">
        /// The number being transformed.
        /// </param>
        /// <returns>
        /// A string representation of the number's corresponding roman numeral.
        /// </returns>
        public static string ToRomanNumeral(this int number)
        {

            var retVal = new StringBuilder(5);
            var valueMap = new SortedDictionary<int, string>
                               {
                                   { 1, "I" },
                                   { 4, "IV" },
                                   { 5, "V" },
                                   { 9, "IX" },
                                   { 10, "X" },
                                   { 40, "XL" },
                                   { 50, "L" },
                                   { 90, "XC" },
                                   { 100, "C" },
                                   { 400, "CD" },
                                   { 500, "D" },
                                   { 900, "CM" },
                                   { 1000, "M" },
                               };

            foreach (var kvp in valueMap.Reverse())
            {
                while (number >= kvp.Key)
                {
                    number -= kvp.Key;
                    retVal.Append(kvp.Value);
                }
            }

            return retVal.ToString();
        }
    }
}
