import mockAxios, { regexPath } from './mock';
import { API_FAQS } from '../scripts/constants';
import faqsData from './data/faqs.json';

mockAxios.onGet(regexPath(`${API_FAQS}/ovens?page=2`)).reply(200, faqsData.page2);
mockAxios.onGet(regexPath(API_FAQS)).reply(200, faqsData.page1);
mockAxios.onGet(regexPath(`${API_FAQS}/search?text=[a-z]+&page=1`)).reply(200, faqsData.searchResult);
mockAxios.onGet(regexPath(`${API_FAQS}/search?text=[a-z]+&page=2`)).reply(200, faqsData.searchResult);
