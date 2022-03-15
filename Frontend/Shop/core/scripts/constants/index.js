export const BASE_URL = window.location.origin;

export const GOOLE_MAP_API = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyCXh-BsP3WW3eRWnldpRJXPXcahYU9zMf8&libraries=places';
export const API_WISHLIST = '/api/sparepart/wishlist';
export const API_PICKUP_LOCATION = '/api/shoppingcart/pickuplocation/';
export const API_PRODUCT_CUSTOMER_CARE = '/api/shoppingcart/updatemethod';
export const API_PRODUCT_DELIVERY = '/api/shoppingcart/product/pickup';
export const API_DELIVERY = '/cartapi/updateshippingmethod';
export const API_SUBMIT_SHOPPING_CART = '/cartapi/updateshippingmethod';
export const API_CART_GET_DELIVERY = '/cartapi/getshippingmethods';
export const API_APPLY_PROMOTION_CODE = '/api/sparepart/cart/applypromotioncode';
export const API_REMOVE_PROMOTION_CODE = '/cartapi/removepromotioncode';
export const API_PERSONAL_DETAIL = '/personaldetailsapi/getpersonaldetails/';
export const API_PERSONAL_DETAIL_SAVE = '/personaldetailsapi/savepersonaldetails/';
export const API_ACCOUNT_DELIVERY = '/contactaddressapi/getdeliverycontactaddressbyid';
export const API_ACCOUNT_ADDRESS_DELIVERY_ADD = '/contactaddressapi/adddeliveryaddress';

export const API_ADDRESS_DELIVERY = 'api/address/delivery';
export const API_ADDRESS_BILLING = 'api/address/billing';
export const API_ACCOUNT_STATE = '/api/account/state';
export const API_ORDER = '/api/sparepart/order/details';
export const API_RECURRING_ORDER_DETAIL = '/api/sparepart/order/recurringdetails';
export const API_ORDER_REORDER = '/api/sparepart/order/reorder';
export const API_CART_COUNT = '/api/sparepart/cart/cartCount';
export const API_CART = '/api/sparepart/cart/getcartpagedetails';
export const API_CART_UPDATE = '/api/sparepart/cart/changecartitem';
export const API_DELIVERY_POPUP = '/metrodeliveryserviceapi/get';
export const API_ADD_TO_CART = '/api/sparePart/cart/addtocart';
export const API_WISHLIST_CREATE = '/api/wishlist/createwishlist';
export const API_WISHLIST_DELETE = '/api/wishlist/deletewishlist';
export const API_WISHLIST_UPDATE = '/api/wishlist/updatewishlist';
export const API_WISHLIST_REMOVEPRODUCT = '/api/wishlist/removeproduct';
export const API_WISHLIST_GETALLWISHLIST = '/api/wishlist/getwishlist';
export const API_WISHLIST_GETWISHLISTDETAIL = '/api/wishlist/wishlistdetail';
export const API_WISHLIST_SHARE_WISHLIST = '/api/wishlist/sharewishlist';
export const API_WISHLIST_MOVE_TO_CART = '/api/wishlist/addwishlisttocart';
export const API_PRODUCT_YOU_MAY_ALSO_LIKE = '/recommendedproductsapi/GetRecommendedProductByCategory';
export const API_SUGGESTION_SEARCH_GLOBAL = 'api/content/quicksearch';
export const API_POSTCODE_PRODUCT = '/SearchApi/ProductAvaibility';
export const API_PRODUCT_COMPARE = 'SearchApi/ProductCompare';
export const API_LOCATION_SUGGESTION = '/locationsuggestionapi/getlocationautocomplete';
export const API_PARTS_DIAGRAM = '/API_PARTS_DIAGRAM';
export const API_DIAGRAM_LIST = '/API_DIAGRAM_LIST';
export const API_RIGHT_NAVIGATION_FIND_PNC = '/api/sparepart/pnc/';
export const API_RIGHT_NAVIGATION_PRODUCT_BUNDLE = '/API_RIGHT_NAVIGATION_PRODUCT_BUNDLE';
export const API_PRODUCT = '/API_PRODUCT';
export const API_RIGHT_NAVIGATION_PRODUCT_BONUS = '/API_RIGHT_NAVIGATION_PRODUCT_BONUS';
export const API_SPARE_PARTS = '/api/sparePart/cart';
export const API_PROMOTIONAL_BANNER = '/API_PROMOTIONAL_BANNER';
export const API_PART = '/api/sparepart/part';
export const API_SPARE_PARTS_CART = 'api/sparepart/cart/getcartpagedetails';
export const API_PART_CATEGORY = 'getpartbycategory';
export const API_PART_RECOMMENDATION = 'api/content/recommendations';
export const API_FAQS = 'api/sparepart/faqs';
export const API_CART_ADD_MULTIPLE = 'api/sparepart/cart/addmultipletocart';
export const API_CART_REORDER = 'api/sparepart/cart/reorder';
export const API_CONTENT_NAVIGATION = 'api/content/navigation';
export const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
export const API_SUGGESTION_SEARCH_GLOBAL_UNILUX = 'api/sparepart/part/searchacessories';
export const API_NEWSLETTER_SUBSCRIBER = '/newslettersubscriberblock/subscribe';

// B2B
export const B2B_API_PART_SEARCH = 'api/sparepart/part/searchpartlist';
export const B2B_API_SAVE_CART_AND_GO_TO_CHECKOUT = 'api/sparepart/cart/savecartandgocheckout';
export const B2B_API_CART_ADD_MULTIPLE = 'api/sparepart/cart/addmultipletocartb2b';
export const B2B_API_GET_FREQUENTLY_ORDERED_PARTS = 'api/content/frequentlyordered';
export const B2B_API_CHANGE_DELIVERY = 'api/address/changedeliveryb2b';

// VINTEC
export const VINTEC_API_PART_RECOMMENDATION_PDP = 'api/content/vintecrecommendations';
export const VINTEC_API_PART_RECOMMENDATION_CART_PAGE = API_PART_RECOMMENDATION;
export const VINTEC_API_PART_RECOMMENDATION_BRAND_PAGE = API_PART_RECOMMENDATION;
export const VINTEC_API_SUGGESTION_SEARCH_GLOBAL = '/api/content/vintec/quicksearch';

// events
export const EVENT_FETCH_RECOMMENDED_DATA = 'EVENT_FETCH_RECOMMENDED_DATA';
export const EVENT_CLOSE_WISHLIST_MODAL_RECOMMENDED = 'EVENT_RECOMMENDED_CLOSE_WISHLIST_MODAL';

// B2B events
export const EVENT_FETCH_FREQUENTLY_ORDERED_DATA = 'EVENT_FETCH_FREQUENTLY_ORDERED_DATA';
export const API_SPAREPART_WHERE_TO_BUY = 'api/sparepart/wheretobuy';

export const API_SIGNUP_NEWSLETTER = '/login/signupnewsletter';
export const API_GET_STATE_LIST = '/api/content/getstatelist/';
export const API_PART_REQUEST_ELIGIBLE_PRICE = 'api/sparepart/part/requestpricefor';
