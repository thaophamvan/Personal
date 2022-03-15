import Http from '../scripts/ultis/Http';
import { API_FAQS } from '../scripts/constants';

class FAQsServices extends Http {
  fetch = () => this.get(API_FAQS);

  fetchByTopic = (topic, page) => this.get(`${API_FAQS}/${topic}?page=${page}`);

  search = (queryString) => this.get(`${API_FAQS}/search?${queryString}`, true);
}

export default new FAQsServices();
