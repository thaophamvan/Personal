import React from 'react';
import { Row, Column } from '../Layout';
import ComponentDemo from '../ComponentDemo';
import PropsTable from '../PropsTable';
import DropDown from '../../../lib/components/dropDown/DropDown';

export default class DropDownsPage extends React.Component {
  constructor() {
    super();
    this.state = { selectedDropDownValue: 2 };
  }

  setSelectedDropDownValue = (selectedDropDownValue) => {
    this.setState({ selectedDropDownValue });
  }

  render() {
    return (
      <div>
        <h1>DropDowns</h1>
        <Row>
          <Column>
            <ComponentDemo>
              <DropDown
                placeholder="Välj vinjett"
                selectedValue={this.state.selectedDropDownValue}
                onChange={this.setSelectedDropDownValue}
                options={[
                  { value: 1, label: 'One' },
                  { value: 2, label: 'Two' },
                  { value: 3, label: 'Three' },
                ]}
              />
            </ComponentDemo>
          </Column>
          <Column>
            <ComponentDemo>
              <DropDown
                showOptionsAbove
                placeholder="Välj vinjett"
                selectedValue={this.state.selectedDropDownValue}
                onChange={this.setSelectedDropDownValue}
                options={[
                  { value: 1, label: 'One' },
                  { value: 2, label: 'Two' },
                  { value: 3, label: 'Three' },
                ]}
              />
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <PropsTable component={DropDown} />
        </Row>
      </div>
    );
  }
}
