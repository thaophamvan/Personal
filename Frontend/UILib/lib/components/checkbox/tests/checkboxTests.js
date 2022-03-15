import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import Checkbox from '../checkbox';
import Icon from '../../icon/icon';

describe('Checkbox', () => {
  it('should render a Checkbox', () => {
    const checkbox = mount(<Checkbox label="This is our label" onChange={() => {}} checked={false} />);
    expect(checkbox).to.have.text('This is our label');
    expect(checkbox).to.have.className('checkbox-field');
  });

  it('should be disabled when disabled', () => {
    const checkbox = mount(<Checkbox disabled checked={false} onChange={() => {}} />);
    expect(checkbox).to.be.disabled();
  });

  it('should call its callback when clicked', () => {
    const onChange = sinon.stub();
    const checkbox = mount(<Checkbox label="This is our label" onChange={onChange} checked={false} />);
    checkbox.simulate('click');
    expect(onChange).to.have.been.calledOnce();
  });

  it('should render correct icon when checked', () => {
    const checkbox = mount(<Checkbox label="This is our label" onChange={() => {}} checked />);
    expect(checkbox.find(Icon).props().shape).to.equal('checked_box');
  });

  it('should render correct icon when unchecked', () => {
    const checkbox = mount(<Checkbox label="This is our label" onChange={() => {}} checked={false} />);
    expect(checkbox.find(Icon).props().shape).to.equal('check_box');
  });
});
