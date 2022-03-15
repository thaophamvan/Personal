import mockAxios, { regexPath } from './mock';
import { API_RIGHT_NAVIGATION_FIND_PNC } from '../scripts/constants';

const mockData = {
  title: 'How do I find my the product number code (PNC)?',
  description: 'You product number code (PNC) is located on your appliance’s serial plate. It is the number listed after ‘Prod.No’ as illustrated in the image below. This serial plate is located in different areas depending on the type of appliance.',
  img: '/dist/images/block-img-bg.svg',
  exampleImgCaption: 'Image: serial plate with PNC',
  categoryTitle: 'Where can I find the serial plate?',
  categoryList: [
    {
      key: 'built-in-oven',
      displayText: 'Built-in over',
    },
  ],
};

const mockCategoryData = {
  displayText: 'Built-in oven',
  description: 'The serial plate with PNC is located on the inside edge of the oven when you open the door. This is highlighted in red below.',
  img: '/dist/images/block-img-bg.svg',
};

mockAxios.onGet(regexPath(`${API_RIGHT_NAVIGATION_FIND_PNC}?category=built-in-oven`)).reply(200, mockCategoryData);
mockAxios.onGet(regexPath(API_RIGHT_NAVIGATION_FIND_PNC)).reply(200, mockData);
