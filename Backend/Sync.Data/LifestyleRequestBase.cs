using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using ThaoPham.Core.Helpers;
using ThaoPham.Core.Services.Abstract;
using ThaoPham.Models.Services.Abstract;
using ThaoPham.Web.Business.LifeStyles.Models;
using EPiServer.Logging.Compatibility;
using EPiServer.ServiceLocation;
using Newtonsoft.Json;

namespace ThaoPham.Web.Business.LifeStyles
{
    public abstract class LifestyleRequestBase<T> where T : class
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private static IHttpClient _httpClient;
        private readonly IEluxCache _eluxCache;
        private static string _baseRequestUri;

        private readonly Stopwatch _stopwatch = new Stopwatch();

        protected abstract ILog Log { get; }
        protected abstract string Endpoint { get; }
        protected abstract HttpMethod HttpRequestMethod { get; }
        protected abstract IEnumerable<KeyValuePair<string, string>> RequestContent { get; }

        protected LifestyleRequestBase(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
            _eluxCache = ServiceLocator.Current.GetInstance<IEluxCache>();
        }
        protected IList<HttpStatusCode> SuccessCodes { get; } = new List<HttpStatusCode> { HttpStatusCode.OK };
        protected string ContentType = "application/x-www-form-urlencoded";
        public virtual async Task<LifestyleResult<T>> ProcessRequest(CancellationToken cancellationToken = default)
        {
            LifestyleResult<T> result;
            if (_baseRequestUri == null)
            {
                var siteSettingPage = SiteSettingsHelper.Instance.GetSiteSettingsPage();
                if (string.IsNullOrEmpty(siteSettingPage?.LifestyleBaseApiUrl))
                    throw new ArgumentNullException($"The setting LifestyleBaseApiUrl must have value");
                _baseRequestUri = siteSettingPage.LifestyleBaseApiUrl;
            }
            if (_httpClient == null)
            {
                _httpClient = _httpClientFactory.Create(_baseRequestUri);
                var acceptHeader = new MediaTypeWithQualityHeaderValue("multipart/form-data");
                if (!_httpClient.DefaultRequestHeaders.Accept.Contains(acceptHeader))
                    _httpClient.DefaultRequestHeaders.Accept.Add(acceptHeader);
            }
                
            //StartMeasurement();
            try
            {
                var hashData = _eluxCache.Get<HashResponse>(LifestyleConstants.HashDataCacheKey);
                HttpResponseMessage response;
                if (hashData == null)
                {
                    using (var requestHash = GetRequest(HttpMethod.Get, LifestyleConstants.GetHash))
                    {
                        response = await _httpClient.SendAsync(requestHash, cancellationToken);
                        hashData = await ProcessHashResponse(response);
                        _eluxCache.AddForce(LifestyleConstants.HashDataCacheKey, hashData, TimeSpan.FromMinutes(4));
                    }
                }

                if (ValidateHashResponse(hashData))
                {
                    var enpoint = CombineEndpointAndQuery(hashData);

                    using (var request = GetRequest(HttpRequestMethod, enpoint))
                    {
                        if (RequestContent != null)
                        {
                            var httpContent = CreateHttpContent(RequestContent);
                            request.Content = httpContent;
                        }
                        using (response = await _httpClient.SendAsync(request, HttpCompletionOption.ResponseHeadersRead, cancellationToken).ConfigureAwait(false))
                        {
                            //response.EnsureSuccessStatusCode();
                            if (response != null && SuccessCodes.Contains(response.StatusCode) /*response.IsSuccessStatusCode*/)
                            {
                                result = await ProcessResponseAsync(response);
                            }
                            else
                            {
                                Log.ErrorFormat(
                                     "Unexpected response, requestUrl: {0}, responseStatusCode: {1}, responseContent: {2}",
                                     response.RequestMessage.RequestUri,
                                     response.StatusCode,
                                     response.Content.ReadAsStringAsync());
                                result = ProcessError(response);
                            }
                        }
                    }
                }
                else
                {
                    result = new LifestyleResult<T>(hashData.Status.ToString(), hashData.Message);
                }
            }
            catch (InvalidOperationException exception)
            {
                //Log.DebugFormat("Time elapsed: {0}", StopMeasurement());
                Log.Error("Operation exception", exception);
                return new LifestyleResult<T>(exception.Message, "Operation cancelled abnormally");
            }
            catch (HttpRequestException exception)
            {
                //Log.DebugFormat("Time elapsed: {0}", StopMeasurement());
                Log.Error("The request failed", exception);
                return new LifestyleResult<T>(exception.Message, "The request failed due to an underlying issue such as network connectivity, DNS failure, server certificate validation or timeout");
            }
            catch (Exception ex)
            {
                Log.Error("Exception when make request to Lifestyle", ex);
                return new LifestyleResult<T>(ex.Message, "Operation cancelled abnormally");
            }

            //Log.DebugFormat("Time elapsed: {0}", StopMeasurement());

            return result;
        }

        protected virtual async Task<LifestyleResult<T>> ProcessResponseAsync(HttpResponseMessage response)
        {
            _ = new LifestyleResult<T>();
            LifestyleResult<T> result;
            if (response.StatusCode == HttpStatusCode.OK)
            {
                try
                {
                    //var data = await response.Content.ReadAsAsync<T>();
                    var stream = await response.Content.ReadAsStreamAsync();
                    var data = DeserializeJsonFromStream<T>(stream);
                    result = new LifestyleResult<T>(data);
                }
                catch (Exception ex)
                {
                    result = new LifestyleResult<T>(response.StatusCode.ToString(), ex.Message);
                    Log.ErrorFormat(" Error URI: {0}, {1}", Endpoint, ex);
                }
            }
            else
            {
                result = new LifestyleResult<T>(response.StatusCode.ToString(), response.ReasonPhrase);
                Log.ErrorFormat(" Error {0}, URI: {1}", response.StatusCode, Endpoint);
            }
            //return await Task.FromResult(new LifestyleResult<T>());
            return result;
        }

        protected virtual LifestyleResult<T> ProcessError(HttpResponseMessage response)
        {
            return new LifestyleResult<T>(response.StatusCode.ToString(), response.ReasonPhrase);
        }
        private HttpContent CreateHttpContent(IEnumerable<KeyValuePair<string, string>> nameValueCollection)
        {
            var httpContent = new FormUrlEncodedContent(nameValueCollection);
            httpContent.Headers.ContentType = new MediaTypeHeaderValue(ContentType);
            return httpContent;
        }
        private TResult DeserializeJsonFromStream<TResult>(Stream stream)
        {
            if (stream == null || stream.CanRead == false)
                return default(TResult);

            using (var sr = new StreamReader(stream))
            using (var jtr = new JsonTextReader(sr))
            {
                var js = new JsonSerializer();
                var searchResult = js.Deserialize<TResult>(jtr);
                return searchResult;
            }
        }
        private HttpRequestMessage GetRequest(HttpMethod method, string endpoint)
        {
            return new HttpRequestMessage(method, endpoint);
        }
        private string CombineEndpointAndQuery(HashResponse hashResponse)
        {
            return $"{Endpoint}?t={hashResponse.CurrentTimestamp}&hash={hashResponse.Hash}";
        }
        private bool ValidateHashResponse(HashResponse hashData)
        {
            if (!hashData.Status)
                Log.ErrorFormat("[Lifestyle Service]: Unexpected response Hash.");

            return hashData.Status;
        }
        private async Task<HashResponse> ProcessHashResponse(HttpResponseMessage responseMessage)
        {
            HashResponse result;
            if (SuccessCodes.Contains(responseMessage.StatusCode))
            {
                try
                {
                    result = await responseMessage.Content.ReadAsAsync<HashResponse>();
                }
                catch (Exception ex)
                {
                    result = new HashResponse { Status = false, Message = ex.Message };
                    Log.ErrorFormat(" Error URI: {0}, {1}", responseMessage.RequestMessage.RequestUri, ex);
                }
            }
            else
            {
                result = new HashResponse { Status = false, 
                    Message = $"Unexpected response, requestUrl: {responseMessage.RequestMessage.RequestUri}, responseStatusCode: {responseMessage.StatusCode}, responseContent: {responseMessage.Content.ReadAsStringAsync()}" };

                Log.ErrorFormat(
                    "Unexpected response, requestUrl: {0}, responseStatusCode: {1}, responseContent: {2}",
                    responseMessage.RequestMessage.RequestUri,
                    responseMessage.StatusCode,
                    responseMessage.Content.ReadAsStringAsync());
            }

            return result;
        }

        private void StartMeasurement()
        {
            if (Log.IsDebugEnabled)
            {
                _stopwatch.Reset();
                _stopwatch.Start();
            }
        }

        private double StopMeasurement()
        {
            if (Log.IsDebugEnabled)
            {
                _stopwatch.Stop();

                return _stopwatch.Elapsed.TotalSeconds;
            }

            return 0;
        }
    }
}
