using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace WebApplication1
{
    public partial class _Default : Page
    {
        protected void Page_Load(object sender, EventArgs e)
        {
            // Create a request for the URL. 
            WebRequest request = WebRequest.Create(
              "http://dev.m-magasin.se/Global/m-magasin/Wide%20pics/widepuff_am_jonas.jpg");
            // If required by the server, set the credentials.
            //request.Credentials = CredentialCache.DefaultCredentials;
            // Get the response.
            WebResponse response = request.GetResponse();
            // Display the status.
            Console.WriteLine(((HttpWebResponse)response).StatusDescription);
            Console.WriteLine(((HttpWebResponse)response).StatusCode);
   
            // Clean up the streams and the response.
            response.Close();
        }
    }
}