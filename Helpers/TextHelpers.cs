using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace TheatreCMS3.Helpers
{
    
        public static class TextHelpers
        {
            public static string TextHelp(string value, int number)
            {


            if (number >= value.Length)
            {
                return value;
            }
            else
            {

                return value.Substring(0, number) + "...";
            }
            }
            /// <summary>
            /// Takes a string and limits it by the number of words. 
            /// </summary>
            /// <param name="value"></param>
            /// <param name="number"></param>
            /// <returns>Returns a string based on the number of words indicated by the input parameter.</returns>
            public static string LimitWords(string value, int number)
            {
                char[] delimiterChars = { ' ', ',', '.', ':', '\t' };
                //Use String.Split() method to "put" every word separated by a delimiting character into a
                //string array. StringSplitOptions.RemoveEmptyEntries removes extra delimiting characters.
                string[] words = value.Split(delimiterChars, StringSplitOptions.RemoveEmptyEntries);
                string result = "";
                if (value.Length > 0 && number > 0)
                {
                    if (words.GetLength(0) <= number)
                    {
                        foreach (string s in words)
                        {
                            result += " " + s;
                        }
                        return result + "...";
                    }
                    else
                    {
                        //if the length of the string array "words" is greater than the input parameter number
                        int i = 0;
                        while (i < number)
                        {
                            result += " " + words[i];
                            i++;
                        }
                        return result + "...";
                    }
                }
                //if the length of the string array is greater than 0 but the input parameter number is 0 or less,
                //return the string. if the string length is 0, return the string
                else
                {
                    foreach (string s in words)
                    {
                        result += " " + s;
                    }
                    return result + "...";
                }
            }


        }

        



    
}