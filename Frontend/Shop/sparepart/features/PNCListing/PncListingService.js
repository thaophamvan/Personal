import Http from '../../../core/scripts/ultis/Http';
import { API_PRODUCT, API_PART } from '../../../core/scripts/constants';

class PncPartListService extends Http {
    fetchData = (body) => this.post(`${API_PART}/pnc-listing`, body, true);
}

export default new PncPartListService();
