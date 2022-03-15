import React from 'react';
import ReactDOM from 'react-dom';

import './styleguide.styl';

import StyleGuide from './styleguide';

const wrapper = document.createElement('main');
wrapper.setAttribute('class', 'klara-app');

document.body.prepend(wrapper);
ReactDOM.render(<StyleGuide />, wrapper);
