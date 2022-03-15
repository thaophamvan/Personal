import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Spinner from '../spinner';
import Icon from '../../icon/icon';

describe('Spinner', () => {
  it('should render a spinner', () => {
    const spinner = mount(<Spinner />);
    expect(spinner.find(Icon).hasClass('spinner--robot')).to.equal(true);
  });

  it('should render a fading spinner when receiving the "fading" type', () => {
    const spinner = mount(<Spinner type="fading" />);
    expect(spinner.find(Icon).hasClass('spinner--fading')).to.equal(true);
  });

  it('should set the width and height to the given size prop', () => {
    const spinner = mount(<Spinner size={10} />);
    expect(spinner.find('svg').instance().getAttribute('width')).to.be.equal('10');
    expect(spinner.find('svg').instance().getAttribute('height')).to.be.equal('10');
  });

  it('should apply classnames given via props', () => {
    const spinner = mount(<Spinner className="testing-classnames" />);
    expect(spinner.find(Icon).hasClass('testing-classnames')).to.equal(true);
    expect(spinner.find(Icon).hasClass('spinner--robot')).to.equal(true);
  });
});
