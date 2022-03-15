module.exports.HttpCodes = {
  success: 200,
  forbiddenError: 403,
  pageNotFound: 404,
  accessDenied: 401,
  internalServerError: 500,
  badGateway: 501,
  serviceUnavailable: 503,
  gatewayTimeout: 504,

}
module.exports.HTTPStatusMessages = {
  OK: 'The request is OK (this is the standard response for successful HTTP requests)',
  created: 'The request has been fulfilled, and a new resource is created',
  accepted: 'The request has been accepted for processing, but the processing has not been completed',
  noContent: 'The request has been successfully processed, but is not returning any content',
  badRequest: 'The request cannot be fulfilled due to bad syntax',
  unauthorized: `The request was a legal request, but the server is refusing to respond to it.
    For use when authentication is possible but has failed or not yet been provided`,
  forbidden: 'The request was a legal request, but the server is refusing to respond to it',
  notFound: 'The requested page could not be found but may be available again in the future',
  internalServerError: 'A generic error message, given when no more specific message is suitable',
}
