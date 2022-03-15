import React from 'react';
import { Row, Column } from '../Layout';
import ComponentDemo from '../ComponentDemo';
import PropsTable from '../PropsTable';
import Switch from '../../../lib/components/switch/switch';

export default class Switches extends React.Component {
  constructor() {
    super();
    this.state = { switchState: false, disabledSwitchState: false };
  }

  toggleSwitchState = () => {
    this.setState({ switchState: !this.state.switchState });
  };

  toggleDisabledSwitchState = () => {
    this.setState({ disabledSwitchState: !this.state.disabledSwitchState });
  };

  render() {
    return (
      <div>
        <h1>Switch</h1>
        <Row>
          <Column>
            <ComponentDemo>
              <Switch
                value={this.state.switchState}
                label="Switch label"
                onChange={this.toggleSwitchState}
              />
            </ComponentDemo>
          </Column>
          <Column>
            <ComponentDemo>
              <Switch
                value={this.state.disabledSwitchState}
                label="Switch label that is super long to show that we cover more than one line a good way. Switch label that is super long to show that we cover more than one line a good way. AND ALSO THIS ONE IS DISABLED!"
                onChange={this.toggleDisabledSwitchState}
                disabled
              />
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <PropsTable component={Switch} />
        </Row>
      </div>
    );
  }
}
