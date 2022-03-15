import React from 'react';
import { expect } from 'chai';
import { shallow, mount } from 'enzyme';
import sinon from 'sinon';

import ToggleButtonGroup from './../toggleButtonGroup';
import Button from './../../button/button';

describe('Toggle Button Group', () => {
  let onActiveIndexChange;
  let onButtonClick;

  before(() => {
    onActiveIndexChange = sinon.stub();
    onButtonClick = sinon.stub();
  });

  it('should set the first button as active activeIndex is set to one', () => {
    const buttonGroup = shallow((
      <ToggleButtonGroup activeIndex={0}>
        <Button />
        <Button />
      </ToggleButtonGroup>));
    expect(buttonGroup.find(Button).first().props().active).to.be.true();
  });

  it('should invoke activeIndexChange and buttonClick if a button is clicked', () => {
    const buttonGroup = mount((
      <ToggleButtonGroup activeIndex={0} onActiveIndexChange={onActiveIndexChange} >
        <Button />
        <Button onClick={onButtonClick} />
      </ToggleButtonGroup>));
    buttonGroup.find(Button).last().simulate('click');

    expect(onButtonClick).to.have.been.calledOnce();
    expect(onButtonClick.args[0][0].type).to.equal('click');
    expect(onActiveIndexChange).to.have.been.calledOnce();
    expect(onActiveIndexChange).to.have.been.calledWith(1);
  });

  it('should round corners for first and last button', () => {
    const buttonGroup = mount((
      <ToggleButtonGroup activeIndex={0} onActiveIndexChange={onActiveIndexChange} >
        <Button />
        <Button />
        <Button />
      </ToggleButtonGroup>));
    expect(buttonGroup.find(Button).at(0).props().roundLeft).to.be.true();
    expect(buttonGroup.find(Button).at(1).props().roundLeft).to.be.false();
    expect(buttonGroup.find(Button).at(1).props().roundRight).to.be.false();
    expect(buttonGroup.find(Button).at(2).props().roundRight).to.be.true();
  });
});
