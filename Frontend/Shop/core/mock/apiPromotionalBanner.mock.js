import mockAxios from './mock';
import { API_PROMOTIONAL_BANNER } from '../scripts/constants';

mockAxios.onPost(API_PROMOTIONAL_BANNER).reply(200, {
  applyCodeMessage: 'The offer code has been applied to your cart',
});
