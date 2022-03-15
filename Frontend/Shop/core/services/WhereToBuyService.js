import Http from '../scripts/ultis/Http';
import { API_SPAREPART_WHERE_TO_BUY } from '../scripts/constants';


class WhereToBuyServices extends Http {
    getData = (partNumber) => this.get(`${API_SPAREPART_WHERE_TO_BUY}/${partNumber}`);
}

export default new WhereToBuyServices();