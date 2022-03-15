import mockAxios, { regexPath } from './mock';
import { API_SPARE_PARTS_CART } from '../scripts/constants';
import cartDetailPage from './data/cart-detail-page.json';

mockAxios.onGet(regexPath(API_SPARE_PARTS_CART)).reply(200, cartDetailPage);
