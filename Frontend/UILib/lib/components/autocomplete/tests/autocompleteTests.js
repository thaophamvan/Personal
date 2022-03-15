import React from 'react';
import { expect } from 'chai';
import { mount } from 'enzyme';
import { stub } from 'sinon';

import Autocomplete from '../autocomplete';
import Icon from '../../icon/icon';
import Badge from '../../badge/badge';
import Spinner from '../../spinner/spinner';
import { KEY_DOWN, KEY_UP, KEY_ENTER, KEY_BACKSPACE } from './../../../utils/keyConstants';

const suggestions = [
  { label: 'One', id: '11' },
  { label: 'Two', id: '22' },
  { label: 'Three', id: '33' },
];

const defaultProps = {
  loading: false,
  suggestions: [],
  items: [],
  onAdd: () => {},
  allowMultiple: true,
  onRemove: () => {},
  onInputChange: () => {},
  onCreate: null,
};

function mountAutocomplete(props) {
  let autocomplete;
  const onInputChange = (value) => {
    autocomplete.setProps({ value });
  };
  autocomplete = mount(<Autocomplete {...props} onInputChange={onInputChange} value="" />);
  return autocomplete;
}

describe('Autocomplete', () => {
  let props;
  beforeEach(() => {
    props = Object.assign({}, defaultProps);
    stub(props, 'onAdd');
    stub(props, 'onRemove');
    stub(props, 'onInputChange');
  });

  afterEach(() => {
    props.onAdd.restore();
    props.onRemove.restore();
    props.onInputChange.restore();
  });

  it('should display suggestions when given by prop', () => {
    props.suggestions = suggestions;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: 'One' } });
    expect(autocomplete.find('li')).to.have.length(3);
  });

  it('should show a loading spinner when fetching suggestions', () => {
    props.suggestions = suggestions;
    props.loading = true;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: 'Four' } });
    expect(autocomplete.find(Spinner)).to.be.present();
  });

  it('should make the first suggestion item to the "active" one', () => {
    props.suggestions = suggestions;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    expect(autocomplete.find('li').first()).to.have.className('autocomplete__suggestion--active');
  });

  it('should change the active item on hover', () => {
    props.suggestions = suggestions;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    autocomplete.find('li').at(1).simulate('mouseEnter');
    expect(autocomplete.find('li').first()).to.not.have.className('autocomplete__suggestion--active');
    expect(autocomplete.find('li').at(1)).to.have.className('autocomplete__suggestion--active');
  });

  it('should allow navigation with arrow keys and change the active suggestion', () => {
    props.suggestions = suggestions;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    autocomplete.simulate('keydown', { keyCode: KEY_DOWN });
    expect(autocomplete.find('li').first()).to.not.have.className('autocomplete__suggestion--active');
    expect(autocomplete.find('li').at(1)).to.have.className('autocomplete__suggestion--active');
    autocomplete.simulate('keydown', { keyCode: KEY_UP });
    expect(autocomplete.find('li').first()).to.have.className('autocomplete__suggestion--active');
    expect(autocomplete.find('li').at(1)).to.not.have.className('autocomplete__suggestion--active');
  });

  it('should not "wrap around" at the top or bottom when navigating', () => {
    props.suggestions = suggestions.slice(0, 2);
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    autocomplete.simulate('keydown', { keyCode: KEY_DOWN });
    autocomplete.simulate('keydown', { keyCode: KEY_DOWN });
    expect(autocomplete.find('li').first()).to.not.have.className('autocomplete__suggestion--active');
    expect(autocomplete.find('li').at(1)).to.have.className('autocomplete__suggestion--active');
    autocomplete.simulate('keydown', { keyCode: KEY_UP });
    autocomplete.simulate('keydown', { keyCode: KEY_UP });
    expect(autocomplete.find('li').first()).to.have.className('autocomplete__suggestion--active');
    expect(autocomplete.find('li').at(1)).to.not.have.className('autocomplete__suggestion--active');
  });

  it('should reset the active item to the first one on input change', () => {
    props.suggestions = suggestions;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    autocomplete.simulate('keydown', { keyCode: KEY_DOWN });
    expect(autocomplete.find('li').first()).to.not.have.className('autocomplete__suggestion--active');
    expect(autocomplete.find('li').at(1)).to.have.className('autocomplete__suggestion--active');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: 'One' } });
    expect(autocomplete.find('li').first()).to.have.className('autocomplete__suggestion--active');
    expect(autocomplete.find('li').at(1)).to.not.have.className('autocomplete__suggestion--active');
  });

  it('should be able to select an item with the mouse', () => {
    props.suggestions = suggestions;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    autocomplete.find('li').first().simulate('click');
    expect(props.onAdd).to.have.been.calledOnce();
    expect(props.onAdd).to.have.been.calledWith(suggestions[0].id);
  });

  it('should be able to select an item with the enter key', () => {
    props.suggestions = suggestions;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    autocomplete.find('li').first().simulate('keydown', { keyCode: KEY_ENTER });
    expect(props.onAdd).to.have.been.calledOnce();
    expect(props.onAdd).to.have.been.calledWith(suggestions[0].id);
  });

  it('should refocus the input field after adding an item', () => {
    props.suggestions = suggestions;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    autocomplete.find('li').first().simulate('click');
    expect(document.activeElement.className).to.have.string('text-field__control');
  });

  it('should not display the input field after choosing one item if only one can be selected', () => {
    props.suggestions = suggestions;
    props.items = [suggestions[0]];
    props.allowMultiple = false;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    expect(autocomplete.find('.autocomplete__input--hidden')).to.be.present();
  });

  it('should render pills for every selected item', () => {
    props.items = suggestions;
    const autocomplete = mountAutocomplete(props);
    expect(autocomplete.find(Badge)).to.have.length(3);
  });

  it('should be possible to remove a selected item by clicking its icon', () => {
    props.suggestions = suggestions;
    props.items = [suggestions[0]];
    const autocomplete = mountAutocomplete(props);
    autocomplete.find(Icon).simulate('click');
    expect(props.onRemove).to.have.been.calledOnce();
    expect(props.onRemove).to.have.been.calledWith(suggestions[0].id);
  });

  it('should be possible to remove the item using backspace if there is an input field and there is no input', () => {
    props.suggestions = suggestions;
    props.items = suggestions.slice(0, 2);
    const autocomplete = mountAutocomplete(props);
    expect(autocomplete.find('input.text-field__control')).to.be.present();
    autocomplete.find('input.text-field__control').simulate('keydown', { keyCode: KEY_BACKSPACE });
    expect(props.onRemove).to.have.been.calledOnce();
    expect(props.onRemove).to.have.been.calledWith(suggestions[1].id);
  });

  it('should be able to remove the pill with backspace even if the text field is not there but is hidden', () => {
    props.suggestions = suggestions;
    props.items = suggestions.slice(0, 1);
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('keydown', { keyCode: KEY_BACKSPACE });
    expect(props.onRemove).to.have.been.calledOnce();
    expect(props.onRemove).to.have.been.calledWith(suggestions[0].id);
  });

  it('should not remove any item if the input field has a value', () => {
    props.suggestions = suggestions;
    props.items = suggestions.slice(0, 2);
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: 'Two' } });
    autocomplete.find('input.text-field__control').simulate('keydown', { keyCode: KEY_BACKSPACE });
    expect(props.onRemove).to.not.have.been.called();
  });

  it('should show the option to create a new item if specified by prop', () => {
    props.onCreate = stub(props, 'onCreate');
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: 'Four' } });
    autocomplete.setProps({ suggestions });
    expect(autocomplete.find('li').last().text()).to.include('skapa ny');
    expect(autocomplete.find('li').last().text()).to.include('Four');
    props.onCreate.restore();
  });

  it('should show the option to create a new item even if there are no suggestions', () => {
    props.onCreate = stub(props, 'onCreate');
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: 'Anton' } });
    autocomplete.setProps({ suggestions: [] });
    expect(autocomplete.find('li').last().text()).to.include('skapa ny');
    expect(autocomplete.find('li').last().text()).to.include('Anton');
    props.onCreate.restore();
  });

  it('should call the prop for creating a new item when clicked', () => {
    props.onCreate = stub(props, 'onCreate');
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: 'Four' } });
    autocomplete.setProps({ suggestions });
    autocomplete.find('li').last().simulate('click');
    expect(props.onCreate).to.have.been.calledOnce();
    expect(props.onCreate).to.have.been.calledWith('Four');
    props.onCreate.restore();
  });

  it('should not show the option to create a new item if it is already a suggestion', () => {
    props.onCreate = stub(props, 'onCreate');
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: 'three' } });
    autocomplete.setProps({ suggestions });
    expect(autocomplete.find('li').last().text()).to.not.include('skapa ny');
    props.onCreate.restore();
  });

  it('should not show the option to create a new item if it is already an item', () => {
    props.onCreate = stub(props, 'onCreate');
    props.items = [{ id: '10', label: 'Four' }];
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: 'Four' } });
    autocomplete.setProps({ suggestions });
    expect(autocomplete.find('li').last().text()).to.not.include('skapa ny');
    props.onCreate.restore();
  });

  it('should not show the option to create a new item if input field is empty', () => {
    props.onCreate = stub(props, 'onCreate');
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    autocomplete.setProps({ suggestions });
    expect(autocomplete.find('li').last().text()).to.not.include('skapa ny');
    props.onCreate.restore();
  });

  it('should use a renderProp to render list items', () => {
    props.renderSuggestion = (id, label) => (
      <div>
        <h2>{ id }</h2>
        <a>{ label }</a>
      </div>
    );
    props.suggestions = suggestions;
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('input.text-field__control').simulate('change', { target: { value: '' } });
    expect(autocomplete.find('h2')).to.have.length(suggestions.length);
    expect(autocomplete.find('a')).to.have.length(suggestions.length);
  });

  it('should use a renderProp to render create-suggestions', () => {
    props.renderCreateSuggestion = (id, label) => (
      <div>`{label} (skapa mig)`</div>
    );
    props.onCreate = stub(props, 'onCreate');
    props.suggestions = [{ id: '1', label: 'gooo' }];
    const autocomplete = mountAutocomplete(props);
    autocomplete.find('input.text-field__control').simulate('focus');
    autocomplete.find('.text-field__control').simulate('change', { target: { value: 'new' } });
    expect(autocomplete.find('li').last().text()).to.include('new (skapa mig)');
    props.onCreate.restore();
  });
});
