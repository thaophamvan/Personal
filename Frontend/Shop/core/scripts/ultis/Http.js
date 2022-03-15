import axios from 'axios';
import { BASE_URL } from '../constants';
import HttpCancelError from './HttpCancelError';

const { CancelToken } = axios;
const { NODE_ENV } = process.env;

export default class Http {
  constructor(baseUrl = null) {
    this.axios = axios.create({
      baseURL: baseUrl || BASE_URL,
    });

    if (NODE_ENV === 'development') {
      this.axios.interceptors.request.use((request) => {
        console.log('Starting request: ', request);
        return request;
      });

      this.axios.interceptors.response.use((response) => {
        console.log('Response: ', response);
        return response;
      });
    }
  }

  handleResponse = ({ data }) => Promise.resolve(data);

  handleError = (err) => {
    if (axios.isCancel(err)) {
      return Promise.reject(new HttpCancelError());
    }
    return Promise.reject(err && err.response && err.response.data);
  };

  handleCancelRequest = (doCancel) => doCancel && this.cancelRequest && this.cancelRequest();

  setCancelRequest = () => ({
    cancelToken: new CancelToken((canceler) => {
      this.cancelRequest = canceler;
    }),
  });

  get(url, cancelRequest = false) {
    this.handleCancelRequest(cancelRequest);
    return this.axios
      .get(url, {
        ...this.setCancelRequest(),
      })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  post(url, body, cancelRequest = false) {
    this.handleCancelRequest(cancelRequest);
    return this.axios
      .post(url, body, {
        ...this.setCancelRequest(),
      })
      .then((response) => this.handleResponse(response))
      .catch(this.handleError);
  }

  put(url, body, cancelRequest = false) {
    this.handleCancelRequest(cancelRequest);
    return this.axios
      .put(url, body, {
        ...this.setCancelRequest(),
      })
      .then(this.handleResponse)
      .catch(this.handleError);
  }

  delete(url, cancelRequest = false) {
    this.handleCancelRequest(cancelRequest);
    return this.axios
      .delete(url, {
        ...this.setCancelRequest(),
      })
      .then(this.handleResponse)
      .catch(this.handleError);
  }
}
