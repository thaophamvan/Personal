import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import { KEY_DOWN, KEY_UP, KEY_ENTER, KEY_ESCAPE, KEY_SPACE } from './../../../utils/keyConstants';

import DropDown from '../DropDown';

const options = [
  { value: 1, label: 'One' },
  { value: 2, label: 'Two' },
  { value: 3, label: 'Three' },
];

describe('DropDown', () => {
  it('should render a DropDown', () => {
    const dropDown = mount(<DropDown placeholder="This is our placeholdertext" />);
    expect(dropDown).to.have.text('This is our placeholdertext');
    expect(dropDown).to.have.className('drop-down');
  });

  it('should use the supplied className', () => {
    const dropDown = mount(<DropDown className="one__two--three" />);
    expect(dropDown).to.have.className('one__two--three');
  });

  it('should not show options when closed', () => {
    const dropDown = mount(<DropDown options={options} />);
    expect(dropDown.find('ul')).not.to.be.present();
  });

  it('should show/hide options on click', () => {
    const dropDown = mount(<DropDown options={options} />);
    dropDown.simulate('click');
    expect(dropDown).to.have.className('drop-down--open');
    dropDown.simulate('click');
    expect(dropDown).not.to.have.className('drop-down--open');
  });

  it('should hide options on blur', () => {
    const dropDown = mount(<DropDown options={options} />);
    dropDown.simulate('click');
    expect(dropDown.find('ul')).to.be.present();
    dropDown.simulate('blur');
    expect(dropDown.find('ul')).not.to.be.present();
  });

  it('setting selectedValue prop should select the correct option', () => {
    const selected = options[1];
    const dropDown = mount(<DropDown options={options} selectedValue={selected.value} />);
    expect(dropDown).to.have.text(selected.label);
    dropDown.simulate('click');
    expect(dropDown.find('li').at(1)).to.have.className('drop-down__option--selected');
  });

  it('setting selectedValue prop should select the correct option even if it is falsy', () => {
    const ownOptions = [
      { value: 1, label: 'One' },
      { value: 0, label: 'Zero' },
      { value: false, label: 'False' },
      { value: '', label: 'Empty string' },
    ];
    const dropDown = mount(<DropDown options={ownOptions} selectedValue={0} />);
    expect(dropDown).to.have.text('Zero');

    dropDown.simulate('click');
    expect(dropDown.find('li').at(1)).to.have.className('drop-down__option--selected');

    dropDown.simulate('blur');
    expect(dropDown.setProps({ selectedValue: false })).to.have.text('False');

    dropDown.simulate('click');
    expect(dropDown.find('li').at(2)).to.have.className('drop-down__option--selected');

    dropDown.simulate('blur');
    expect(dropDown.setProps({ selectedValue: '' })).to.have.text('Empty string');

    dropDown.simulate('click');
    expect(dropDown.find('li').at(3)).to.have.className('drop-down__option--selected');
  });

  it('clicking an option should fire onChange with the correct value', () => {
    const onChange = sinon.stub();
    const dropDown = mount(<DropDown options={options} onChange={onChange} />);
    dropDown.simulate('click');
    dropDown.find('li').first().simulate('click');
    expect(onChange).to.have.been.calledOnce();
    expect(onChange).to.have.been.calledWith(options[0].value);
  });

  it('should open and select with arrow/enter key', () => {
    const onChange = sinon.stub();
    const dropDown = mount(<DropDown options={options} onChange={onChange} />);
    dropDown.simulate('focus');
    expect(dropDown.find('ul')).not.to.be.present();
    dropDown.simulate('keydown', { keyCode: KEY_DOWN });
    expect(dropDown.find('ul')).to.be.present();
    dropDown.simulate('keydown', { keyCode: KEY_ENTER });
    expect(onChange).to.have.been.calledOnce();
    expect(onChange).to.have.been.calledWith(options[0].value);
    expect(dropDown.find('ul')).not.to.be.present();
  });

  it('should open and select with space key', () => {
    const onChange = sinon.stub();
    const dropDown = mount(<DropDown options={options} onChange={onChange} />);
    dropDown.simulate('focus');
    expect(dropDown.find('ul')).not.to.be.present();
    dropDown.simulate('keydown', { keyCode: KEY_SPACE });
    expect(dropDown.find('ul')).to.be.present();
    dropDown.simulate('keydown', { keyCode: KEY_DOWN });
    dropDown.simulate('keydown', { keyCode: KEY_SPACE });
    expect(onChange).to.have.been.calledOnce();
    expect(onChange).to.have.been.calledWith(options[0].value);
    expect(dropDown.find('ul')).not.to.be.present();
  });

  it('should highlight option with mouse', () => {
    const dropDown = mount(<DropDown options={options} />);
    dropDown.simulate('click');
    dropDown.find('li').first().simulate('mouseEnter');
    expect(dropDown.find('li').first()).to.have.className('drop-down__option--highlighted');
    dropDown.find('li').last().simulate('mouseEnter');
    expect(dropDown.find('li').last()).to.have.className('drop-down__option--highlighted');
    dropDown.find('ul').simulate('mouseLeave');
    expect(dropDown.find('li').last()).not.to.have.className('drop-down__option--highlighted');
  });

  it('should highlight option with keyboard', () => {
    const dropDown = mount(<DropDown options={options} />);
    dropDown.simulate('click');
    dropDown.simulate('keydown', { keyCode: KEY_UP });
    expect(dropDown.find('li').last()).to.have.className('drop-down__option--highlighted');
    dropDown.simulate('keydown', { keyCode: KEY_DOWN });
    expect(dropDown.find('li').first()).to.have.className('drop-down__option--highlighted');
  });

  it('should close on esc', () => {
    const dropDown = mount(<DropDown options={options} />);
    dropDown.simulate('click');
    dropDown.simulate('keydown', { keyCode: KEY_ESCAPE });
    expect(dropDown.find('ul')).not.to.be.present();
  });

  it('should show options above', () => {
    const dropDown = mount(<DropDown options={options} showOptionsAbove />);
    dropDown.simulate('click');
    expect(dropDown).to.have.className('drop-down--show-options-above');
  });

  it('should not crash if a non existent selectedValue is used', () => {
    const dropDown = mount(<DropDown options={options} selectedValue="a-random-value" />);
    expect(dropDown).to.be.present();
  });
});
