import React from 'react';
import { Row, Column } from '../Layout';
import PropsTable from '../PropsTable';
import ComponentDemo from '../ComponentDemo';
import Tooltip from '../../../lib/components/toolTip/toolTip';

const wrapperStyles = {
  width: '100px',
  height: '100px',
  background: 'lightgray',
  position: 'relative',
};
export default class TooltipPage extends React.Component {
  constructor() {
    super();

    this.state = { showTooltip: false };
  }

  onShowTooltip = () => {
    this.setState({ showTooltip: true });
  };

  onHideTooltip = () => {
    this.setState({ showTooltip: false });
  };

  render() {
    return (
      <div>
        <h1>Tooltip</h1>
        <h2>Description</h2>
        <p>
          {`The parent wrapper of the tooltip container should have position:relative; to enable tooltip
          to align properly. Renderlogics should be handled outside of the component
          scope of Tooltip. In very special cases, where onMouseEnter and onMouseLeave
          would be absent on a disabled parent, you might want to show Tooltip using CSS. Simply add ".klara-ui-tooltip__hoverable" to the parent container.`}
        </p>
        <Row>
          <Column>
            <h2>Direction right</h2>
            <ComponentDemo>
              <div style={wrapperStyles}>
                <Tooltip direction="right">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </Tooltip>
              </div>
            </ComponentDemo>
          </Column>
          <Column>
            <h2>Direction left</h2>
            <ComponentDemo>
              <div style={wrapperStyles}>
                <Tooltip direction="left">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </Tooltip>
              </div>
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <Column>
            <h2>Direction up</h2>
            <ComponentDemo>
              <div style={wrapperStyles}>
                <Tooltip direction="up">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </Tooltip>
              </div>
            </ComponentDemo>
          </Column>
          <Column>
            <h2>Direction down</h2>
            <ComponentDemo>
              <div style={wrapperStyles}>
                <Tooltip direction="down">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </Tooltip>
              </div>
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <Column>
            <h2>Mouseover (react-rendered) - Direction right</h2>
            <ComponentDemo>
              <div
                style={wrapperStyles}
                onFocus={this.onShowTooltip}
                onBlur={this.onHideTooltip}
                onMouseOver={this.onShowTooltip}
                onMouseOut={this.onHideTooltip}
              >
                {this.state.showTooltip && (
                  <Tooltip direction="right">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </Tooltip>
                )}
              </div>
            </ComponentDemo>
          </Column>
          <Column>
            <h2>Mouseover (using CSS) - Direction left</h2>
            <ComponentDemo>
              <div style={wrapperStyles} className="klara-ui-tooltip__hoverable">
                <Tooltip direction="left">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                  dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                  aliquip ex ea commodo consequat.
                </Tooltip>
              </div>
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <PropsTable component={Tooltip} />
        </Row>
      </div>
    );
  }
}
