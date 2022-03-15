import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Switch from '../switch';

describe('Switch', () => {
  it('should render a switch', () => {
    const switchComponent = mount(<Switch />);
    expect(switchComponent).to.have.className('switch');
  });

  it('should call the onChange handler when clicked', () => {
    const onChange = sinon.stub();
    const switchComponent = mount(<Switch onChange={onChange} />);

    switchComponent.find('input').simulate('change');

    expect(onChange).to.have.been.called();
  });
});
