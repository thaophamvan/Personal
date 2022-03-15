import mockAxios, { regexPath } from './mock';

import { API_PART_RECOMMENDATION } from '../scripts/constants';
import recommendedData from './data/recommended.json';

mockAxios.onGet(regexPath(`${API_PART_RECOMMENDATION}/part-number?isWishlist=false`)).reply(200, recommendedData);
