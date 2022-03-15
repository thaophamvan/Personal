// import mockAxios from './mock';
// import myaccount from './data/myaccount';
// import { API_PERSONAL_DETAIL, API_ACCOUNT_DELIVERY, API_ACCOUNT_BILLING, API_ACCOUNT_STATE, API_ORDER } from '../scripts/constants';

// mockAxios.onGet(`${API_PERSONAL_DETAIL}/?Id=1`).reply(200, myaccount.personalDetail);

// mockAxios.onPost(API_PERSONAL_DETAIL).reply(200);

// mockAxios.onGet(`${API_ACCOUNT_DELIVERY}/1`).reply(200, myaccount.addressDetail);
// mockAxios.onGet(`${API_ACCOUNT_BILLING}/1`).reply(200, myaccount.addressDetail);

// mockAxios.onPost(API_ACCOUNT_DELIVERY).reply(200, myaccount.addressData);

// mockAxios.onPut(API_ACCOUNT_DELIVERY).reply(200, myaccount.addressData);

// mockAxios.onDelete(`${API_ACCOUNT_DELIVERY}/userId/1`).reply(200);

// mockAxios.onPost(API_ACCOUNT_BILLING).reply(406, { message: 'Error message' });

// mockAxios.onPut(API_ACCOUNT_BILLING).reply(406, { message: 'Error message' });

// mockAxios.onDelete(`${API_ACCOUNT_BILLING}/userId/1`).reply(200);

// mockAxios.onGet(`${API_ACCOUNT_STATE}`).reply(200, myaccount.stateData);

// mockAxios.onGet(`${API_ORDER}/?id=PO123456`).reply(200, myaccount.orderDetail);
