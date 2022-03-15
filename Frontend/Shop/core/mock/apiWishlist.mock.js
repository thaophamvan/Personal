import mockAxios, { regexPath } from './mock';

import { API_WISHLIST } from '../scripts/constants';

import wishlist from './data/wishlist.json';

// const deleteProducts = ['productCode', 'productCode1', 'productCode2', 'productCode3', 'productCode4', 'productCode5'];
// deleteProducts.forEach((productCode) => {
//   mockAxios.onDelete(`${API_WISHLIST}/1?productCode=${productCode}`).reply(200);
// });

// mockAxios.onPost(API_WISHLIST).reply(200, wishlist.new);
// mockAxios.onGet(new RegExp(`${`${API_WISHLIST}/1`.replace(/\//g, '\\/')}`)).reply(200, wishlist.products);
// mockAxios.onGet(new RegExp(`${API_WISHLIST.replace(/\//g, '\\/')}`)).reply(200, wishlist.list);
// mockAxios.onPost(API_WISHLIST_CREATE).reply(200);
// mockAxios.onDelete(`${API_WISHLIST}/1`).reply(200);
mockAxios
  .onPost(regexPath(API_WISHLIST))
  .replyOnce(200, wishlist.addProductSuccess)
  .onPost(regexPath(API_WISHLIST))
  .replyOnce(400, wishlist.addProducssFail);

mockAxios.onGet(regexPath(`${API_WISHLIST}?productCode=[a-z0-9A-Z_]+`)).reply(200, wishlist.productWishlist);
mockAxios.onGet(regexPath(API_WISHLIST)).reply(200, wishlist.productWishlist);
mockAxios.onGet(regexPath(`${API_WISHLIST}?sortBy=[a-zA-Z]+`)).reply(200, wishlist.sortData);
mockAxios.onPut(regexPath(`${API_WISHLIST}/[a-z\\-0-9]+`)).reply(200);

mockAxios.onDelete(regexPath(`${API_WISHLIST}/[a-z0-9]+`)).reply(200, {});
mockAxios.onGet(regexPath(`${API_WISHLIST}/[a-z0-9]+$`)).reply(200, wishlist.wishlistDetail);
mockAxios.onGet(regexPath(`${API_WISHLIST}/[a-z0-9]+?sortBy=[a-zA-Z]+$`)).reply(200, wishlist.wishlistDetail);
mockAxios.onPost(regexPath(`${API_WISHLIST}/[a-z0-9]+/addtocart`)).reply(200, wishlist.wishlistAddToCart);
mockAxios.onPost(regexPath(`${API_WISHLIST}/[a-z0-9]+/share$`)).reply(200, { message: 'share success' });
mockAxios.onDelete(regexPath(`${API_WISHLIST}/[a-z0-9]+/product/[a-zA-Z0-9]+$`)).reply(200, { itemCountStr: '0 items saved' });
