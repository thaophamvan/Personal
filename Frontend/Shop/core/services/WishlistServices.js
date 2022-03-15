import Http from '../scripts/ultis/Http';
import { API_WISHLIST } from '../scripts/constants';

class WishlistServices extends Http {
  addProduct = (body = { productCode: '', name: null, id: '' }) => this.post(API_WISHLIST, body);

  fetchWishlist = (queryString = '') => this.get(`${API_WISHLIST}${queryString ? `?${queryString}` : ''}`, true);

  updateWishlist = (id, body = { name: '' }) => this.put(`${API_WISHLIST}/${id}`, body);

  deleteById = (id) => this.delete(`${API_WISHLIST}/${id}`);

  create = (body = { name: '' }) => this.post(API_WISHLIST, body);

  fetchById = (id, queryString = '') => this.get(`${API_WISHLIST}/${id}${queryString ? `?${queryString}` : ''}`, true);

  removeProduct = (id, productCode) => this.delete(`${API_WISHLIST}/${id}/product?partCode=${productCode}`);

  shareWishlist = (id, body) => this.post(`${API_WISHLIST}/${id}/share`, body);

  moveToCart = (id) => this.post(`${API_WISHLIST}/${id}/addtocart`, { id });
}

export default new WishlistServices();
