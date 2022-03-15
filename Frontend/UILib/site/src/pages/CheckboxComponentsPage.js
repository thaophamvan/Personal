import React from 'react';
import { Row, Column } from '../Layout';
import ComponentDemo from '../ComponentDemo';
import PropsTable from '../PropsTable';
import Checkbox from '../../../lib/components/checkbox/checkbox';

export default class CheckboxComponentsPage extends React.Component {
  state = {
    toggleValue: false,
  };

  changeToggle = () =>
    this.setState(state => ({
      toggleValue: !state.toggleValue,
    }));

  render() {
    return (
      <div>
        <h1>Checkbox</h1>

        <Row>
          <Column>
            <ComponentDemo>
              <div>
                <Checkbox label="Lorem Ipsum" checked={this.state.toggleValue} onChange={this.changeToggle} />
                <Checkbox disabled label="Lorem Ipsum Dolor Sit Amet Lorem Ipsum Dolor Sit Amet" checked={false} onChange={() => {}} />
              </div>
            </ComponentDemo>
          </Column>
        </Row>

        <Row>
          <Column>
            <div className="icons-page__list" />
          </Column>
        </Row>

        <Row>
          <Column>
            <h2>Custom Icons</h2>
            <div className="icons-page__list" />
          </Column>
        </Row>

        <Row>
          <PropsTable component={Checkbox} />
        </Row>
      </div>
    );
  }
}
