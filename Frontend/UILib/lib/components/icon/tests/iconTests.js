import React from 'react';
import sinon from 'sinon';
import { expect } from 'chai';
import { mount } from 'enzyme';

import Icon from './../icon';
import standardShapes from '../../../utils/standardShapes';
import customShapes from '../../../utils/customShapes';

describe('Icon', () => {
  it('should render an icon', () => {
    const icon = mount(<Icon shape="add" />);
    expect(icon.find('svg')).to.be.present();
  });

  it('should set width and height of the svg if specified', () => {
    const icon = mount(<Icon shape="add" size={1337} />);
    expect(icon.find('svg')).to.be.present();
    expect(icon.find('svg')).to.have.attr('width', '1337');
    expect(icon.find('svg')).to.have.attr('height', '1337');
  });

  it('should render the large version of standard shapes by default', () => {
    const icon = mount(<Icon shape="add" />);
    expect(icon.find('svg')).to.have.attr('viewBox', '0 0 24 24');
  });

  it('should render the small version of standard shapes when the small prop is set', () => {
    const icon = mount(<Icon shape="add" small />);
    expect(icon.find('svg')).to.have.attr('viewBox', '0 0 18 18');
  });

  it('should render custom shapes', () => {
    const icon = mount(<Icon shape="logo" />);
    expect(icon.find('svg')).to.be.present();
  });

  it('should not render undefined shapes', () => {
    const icon = mount(<Icon shape="DOES_NOT_EXIST" />);
    expect(icon.find('svg')).to.not.be.present();
  });

  it('should render regular size icons for all standard shapes', () => {
    Object.keys(standardShapes).forEach((shapeName) => {
      const icon = mount(<Icon shape={shapeName} />);
      expect(icon.find('svg')).to.be.present();
    });
  });

  it('should render small size icons for all standard shapes', () => {
    Object.keys(standardShapes).forEach((shapeName) => {
      const icon = mount(<Icon shape={shapeName} small />);
      expect(icon.find('svg')).to.be.present();
    });
  });

  it('should call a given onClick handler on being clicked', () => {
    const onClickStub = sinon.stub();
    const wrapper = mount(<Icon shape="remove" onClick={onClickStub} />);

    wrapper.simulate('click');

    expect(onClickStub).to.have.been.calledOnce();
  });

  describe('Custom shapes', () => {
    it('should render icons for all custom shapes', () => {
      Object.keys(customShapes).forEach((shapeName) => {
        const icon = mount(<Icon shape={shapeName} />);
        expect(icon.find('svg')).to.be.present();
      });
    });
  });
});
