import React from 'react';
import uuidv4 from 'uuid/v4';
import { Row, Column } from '../Layout';
import ComponentPlayground from '../ComponentPlayground';
import PropsTable from '../PropsTable';
import Autocomplete from '../../../lib/components/autocomplete/autocomplete';
import TextField from '../../../lib/components/textField/textField';

const data = [
  { label: 'One', id: '11' },
  { label: 'Two', id: '22' },
  { label: 'Three', id: '33' },
  { label: 'Four', id: '44' },
  { label: 'Five', id: '55' },
  { label: 'Six', id: '66' },
];

const defaultData = [
  { label: 'Three', id: '33' },
  { label: 'Six', id: '66' },
];

export default class AutocompletePage extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [],
      suggestions: data,
      value: '',
    };
  }

  onAdd = (id) => {
    console.log('onAdd', id);
    const { items, suggestions } = this.state;
    items.push(suggestions.find(s => s.id === id));
    this.setState({ value: '', items, suggestions: defaultData });
  }

  onRemove = (id) => {
    const { items } = this.state;
    this.setState({ items: items.filter(i => i.id !== id) });
  }

  onInputChange = (value) => {
    if (value.trim().length === 0) {
      this.setState({ value, suggestions: defaultData });
    } else {
      this.setState({ value, suggestions: data.filter(item => item.label.includes(value)) });
    }
  }

  onCreate = (value) => {
    const { items } = this.state;
    items.push({ id: uuidv4(), label: value });
    this.setState({ value: '', items, suggestions: defaultData });
  }

  onFocus = () => {
    this.setState({ suggestions: defaultData });
  }

  render() {
    const { items, suggestions, value } = this.state;
    const filteredSuggestions = suggestions.filter(s => !items.find(i => i.id === s.id));

    return (
      <div>
        <h1>Autocomplete</h1>
        <h2>Example</h2>
        <p>This is a complex component that can be used in a number of ways.<br />
        It requires you to manage the suggestions and selected items,
        as well as the manipulation of these, from outside the component.<br />
        For best understanding, check the prop table on this page and try it out for yourself.
        </p>
        <p>Searchable words are One, Two, Three, Four, Five, and Six.</p>
        <Row>
          <Column>
            <ComponentPlayground excludedProps={['className', 'staticLabel']} nestedComponents={[TextField]}>
              <Autocomplete
                suggestions={filteredSuggestions}
                items={this.state.items}
                onAdd={this.onAdd}
                onRemove={this.onRemove}
                onInputChange={this.onInputChange}
                onCreate={this.onCreate}
                onFocus={this.onFocus}
                value={value}
                label="Number"
                allowMultiple
              />
            </ComponentPlayground>
          </Column>
        </Row>
        <Row>
          <PropsTable component={Autocomplete} />
        </Row>
        <Row>
          <p>
            All props that is not taken care of by the Autocomplete
            component will be passed through to the underlying TextField
          </p>
        </Row>
      </div>);
  }
}
