import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

import TextField from '../textField';

import Spinner from '../../spinner/spinner';

describe('TextField', () => {
  describe('Built-in input', () => {
    it('should mount', () => {
      const fieldWrapper = mount(<TextField label="Testing Ipsum" value="" />);
      expect(fieldWrapper).to.exist();

      const multiLineFieldWrapper = mount(<TextField label="Testing Ipsum" value="" multiLine />);
      expect(multiLineFieldWrapper).to.exist();
    });

    it('should use plain input', () => {
      const wrapper = mount(<TextField label="Testing Ipsum" value="" />);
      expect(wrapper.find('input')).to.exist();
    });

    it('should use textarea if <multiLine> prop is set', () => {
      const wrapper = mount(<TextField multiLine label="Testing Ipsum" value="" />);
      expect(wrapper.find('textarea')).to.exist();
    });

    it('should reflect <value>', () => {
      let wrapper = mount(<TextField value="Some default value" />);
      expect(wrapper.find('input').prop('value')).to.be.equal('Some default value');

      wrapper = mount(<TextField multiLine value="Some default value" />);
      expect(wrapper.find('textarea').prop('value')).to.be.equal('Some default value');
    });

    it('should call the given <onChange> on any change', () => {
      const onChangeStub = sinon.stub();

      const wrapper = mount(<TextField value="Anton" onChange={onChangeStub} />);
      wrapper.find('input').props().onChange({ target: { value: 'Lorem Ipsum' } });

      expect(onChangeStub).to.have.been.calledOnce();

      const multiLineWrapper = mount(<TextField multiLine value="Anton" onChange={onChangeStub} />);
      multiLineWrapper.find('textarea').props().onChange({ target: { value: 'Lorem Ipsum' } });

      expect(onChangeStub).to.have.been.calledTwice();
    });

    it('should not render <label>, <palcaeholder>, <helperText> & <errorText> if not set', () => {
      const wrapper = mount(<TextField value="" />);

      const label = wrapper.find('.text-field__label');
      const placeholder = wrapper.find('.text-field__hint');
      const errorText = wrapper.find('.text-field__error-text');
      const helperText = wrapper.find('.text-field__helper-text');

      expect(label.exists()).to.be.false();
      expect(placeholder.exists()).to.be.false();
      expect(errorText.exists()).to.be.false();
      expect(helperText.exists()).to.be.false();
    });

    it('should render <label> with proper value', () => {
      const wrapper = mount(<TextField value="" label="Proper Label" />);
      const label = wrapper.find('.text-field__label');

      expect(label.text()).to.be.equal('Proper Label');
    });

    it('should render <placeholder> with proper value', () => {
      const wrapper = mount(<TextField value="" placeholder="Proper Hint" />);
      const input = wrapper.find('input');

      expect(input).to.have.attr('placeholder', 'Proper Hint');
    });

    it('should not render <placeholder> if <value> is set', () => {
      const wrapper = mount(<TextField value="123" placeholder="Proper Hint" />);
      const input = wrapper.find('input');

      expect(input).to.have.attr('placeholder', '');
    });

    it('should not render <placeholder> if <label> is set when idle', () => {
      const wrapper = mount(<TextField value="" label="123" placeholder="Proper Hint" />);
      const input = wrapper.find('input');

      expect(input).to.have.attr('placeholder', '');
    });

    it('should render <helperText> with proper value', () => {
      const wrapper = mount(<TextField value="" helperText="Helper text" />);
      const helperText = wrapper.find('.text-field__helper-text');

      expect(helperText.text()).to.be.eql('Helper text');
    });

    it('should render <helperText> using a render prop if supplied', () => {
      const renderHelper = () => (
        <span>Kanske ett datum här</span>
      );
      const wrapper = mount(<TextField
        value=""
        helperText=""
        renderHelperText={renderHelper}
      />);
      const helperText = wrapper.find('.text-field__helper-text');
      expect(helperText.text()).to.be.eql('Kanske ett datum här');
    });

    it('should render <errorText> with proper value & trigger error-state', () => {
      const wrapper = mount(<TextField value="" errorText="Error Description" />);
      const errorText = wrapper.find('.text-field__error-text');

      // .hasClass() on wrapper is tricky with mount()...
      expect(wrapper.children().hasClass('text-field--invalid')).to.be.true();

      expect(errorText.exists()).to.be.true();
      expect(errorText.text()).to.be.eql('Error Description');
    });

    it('should prefer <errorText> over <helperText> if both are set', () => {
      const wrapper = mount(<TextField value="" helperText="Text" errorText="Error Description" />);

      const errorText = wrapper.find('.text-field__error-text');
      const helperText = wrapper.find('.text-field__helper-text');

      expect(errorText.exists()).to.be.true();
      expect(helperText.exists()).to.be.false();
    });

    it('should render loader if <loading> property is set', () => {
      const wrapper = mount(<TextField label="With Icon" value="" loading />);
      const spinner = wrapper.find(Spinner);

      expect(spinner).to.exist();
      expect(spinner.props().type).to.equal('fading');
    });

    it('should not render counter by default and if <maxLength> is less then zero', () => {
      let wrapper = mount(<TextField value="" />);
      expect(wrapper.find('.field-counter').exists()).to.be.false();

      wrapper = mount(<TextField maxLength={-100} value="" />);
      expect(wrapper.find('.field-counter').exists()).to.be.false();
    });

    it('should show counter if <maxLength> is greater then zero', () => {
      const wrapper = mount(<TextField maxLength={10} value="" />);
      expect(wrapper.find('.field-counter').exists()).to.be.true();
      expect(wrapper.find('.field-counter').hasClass('text-field__counter')).to.be.true();
    });

    it('should reflect difference between <maxLength> and <value> length in counter', () => {
      let wrapper = mount(<TextField maxLength={10} value="" />);
      expect(wrapper.find('.field-counter').text()).to.have.string('10');

      wrapper = mount(<TextField maxLength={10} value="ab" />);
      expect(wrapper.find('.field-counter').text()).to.have.string('8');

      wrapper.setProps({ value: 'abcd' });
      expect(wrapper.find('.field-counter').text()).to.have.string('6');
    });

    it('should render "maxed" counter if <value> length is greater then <maxLength>', () => {
      const wrapper = mount(<TextField maxLength={2} value="True" />);

      expect(wrapper.find('.field-counter').text()).to.have.string('-2');
      expect(wrapper.find('.field-counter').hasClass('field-counter--maxed')).to.be.true();
    });

    it('should set <maxLength> for input control if <maxLength> and <shouldClipAtMaxLength> are set', () => {
      const wrapper = mount(<TextField value="" maxLength={10} shouldClipAtMaxLength />);
      expect(wrapper.find('input').prop('maxLength')).to.be.equal(10);
    });

    it('should not set <maxLength> for input control if <shouldClipAtMaxLength> is set, but <maxLength> is not', () => {
      const wrapper = mount(<TextField value="" shouldClipAtMaxLength />);
      expect(wrapper.find('input').prop('maxLength')).to.be.equal(-1);
    });

    it('should go into disabled-state if <disabled> property is set', () => {
      let wrapper = mount(<TextField value="Anton" disabled />);
      let input = wrapper.find('input');

      expect(wrapper.children().hasClass('text-field--disabled')).to.be.true();
      expect(input.prop('disabled')).to.be.true();

      wrapper = mount(<TextField multiLine value="Anton" disabled />);
      input = wrapper.find('textarea');

      expect(wrapper.children().hasClass('text-field--disabled')).to.be.true();
      expect(input.prop('disabled')).to.be.true();
    });

    it('should go into filled-state if <value> property is set', () => {
      let wrapper = mount(<TextField value="" />);
      expect(wrapper.children().hasClass('text-field--filled')).to.be.false();

      wrapper = mount(<TextField value={123} />);
      expect(wrapper.children().hasClass('text-field--filled')).to.be.true();
    });

    it('should go focus input control if click on wrapper', () => {
      const wrapper = mount(<TextField value="" />);

      const input = wrapper.find('input').getDOMNode();
      const focusStub = sinon.stub(input, 'focus');

      // I would rather trigger focus on wrapper
      // but this won't work, since internally use node.focus();
      wrapper.children().simulate('focus');
      expect(focusStub).to.be.calledOnce();
    });

    it('should go into focused-state if click on input control', () => {
      const wrapper = mount(<TextField value="" />);

      // I would rather trigger focus on wrapper
      // but this won't work, since internally use node.focus();
      wrapper.find('input').simulate('focus');

      expect(wrapper.children().hasClass('text-field--focused')).to.be.true();
      expect(wrapper.state()).to.have.property('focused', true);
    });

    it('should call the given <onBlur> on internal input blur event', () => {
      const onBlurStub = sinon.stub();
      const wrapper = mount(<TextField value="Anton" onBlur={onBlurStub} />);

      wrapper.find('input').simulate('blur');
      expect(onBlurStub).to.have.been.calledOnce();
    });

    it('should call the given <onFocus> on internal input focus event', () => {
      const onFocusStub = sinon.stub();
      const wrapper = mount(<TextField value="Anton" onFocus={onFocusStub} />);

      wrapper.find('input').simulate('focus');
      expect(onFocusStub).to.have.been.calledOnce();
    });
  });

  it('should use the renderProp if supplied', () => {
    const wrapper = mount(<TextField
      value=""
      renderInput={inputProps => (
        <div>
          <span>Special stuff</span>
          <input type="text" {...inputProps} />{' '}
        </div>
        )}
    />);

    wrapper.setProps({ value: 'Lorem Ipsum' });
    expect(wrapper.find('span').text()).to.equal('Special stuff');
  });

  it('should be password type', () => {
    const wrapper = mount(<TextField value="123" type="password" />);
    const input = wrapper.find('input');

    expect(input).to.have.attr('type', 'password');
  });

  it('should be email type', () => {
    const wrapper = mount(<TextField value="123" type="email" />);
    const input = wrapper.find('input');

    expect(input).to.have.attr('type', 'email');
  });

  it('should be url type', () => {
    const wrapper = mount(<TextField value="123" type="url" />);
    const input = wrapper.find('input');

    expect(input).to.have.attr('type', 'url');
  });

  it('should be text type when type is missing', () => {
    const wrapper = mount(<TextField value="123" />);
    const input = wrapper.find('input');

    expect(input).to.have.attr('type', 'text');
  });
});
