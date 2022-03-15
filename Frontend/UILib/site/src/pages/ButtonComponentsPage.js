import React from 'react';

import PropsTable from '../PropsTable';
import Button from '../../../lib/components/button/button';
import ToggleButtonGroup from '../../../lib/components/toggleButtonGroup/toggleButtonGroup';
import ComponentDemo from '../ComponentDemo';
import { Row, Column } from '../Layout';

export default class ButtonsPage extends React.Component {
  constructor() {
    super();
    this.state = { toggleButtonGroupIndex: 0 };
  }

  setToggleButtonGroupIndex = (toggleButtonGroupIndex) => {
    this.setState({ toggleButtonGroupIndex });
  }

  render() {
    return (
      <div>
        <h1>Button</h1>
        <Row>
          <Column>
            <ComponentDemo>
              <Button type="danger">Danger</Button>
            </ComponentDemo>
          </Column>
          <Column>
            <ComponentDemo>
              <Button type="success" primary>Success</Button>
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <Column>
            <ComponentDemo>
              <Button icon="add">Button with icon</Button>
            </ComponentDemo>
          </Column>
          <Column>
            <ComponentDemo>
              <Button icon="fullscreen" size="large" />
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <Column>
            <ComponentDemo>
              <Button loading>Loading...</Button>
            </ComponentDemo>
          </Column>
          <Column>
            <ComponentDemo>
              <Button href="//expressenab.github.io/klara-ui">Button as a link</Button>
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <Column>
            <ComponentDemo>
              <Button tooltip="Here!">Button with tooltip</Button>
            </ComponentDemo>
          </Column>
          <Column />
        </Row>
        <Row>
          <Column>
            <ComponentDemo title="Toggle Button Group">
              <ToggleButtonGroup
                activeIndex={this.state.toggleButtonGroupIndex}
                onActiveIndexChange={this.setToggleButtonGroupIndex}
              >
                <Button>1</Button>
                <Button>2</Button>
                <Button>3</Button>
                <Button>4</Button>
                <Button>5-Högst</Button>
              </ToggleButtonGroup>
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <PropsTable component={Button} />
        </Row>
      </div>
    );
  }
}
