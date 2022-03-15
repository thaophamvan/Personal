import React from 'react';
import { Row, Column } from '../Layout';
import ComponentDemo from '../ComponentDemo';
import PropsTable from '../PropsTable';
import Notification from '../../../lib/components/notification/notification';
import Button from '../../../lib/components/button/button';

class BadgeComponentsPage extends React.Component {
  state = {
    hasDismissableError: false,
    hasNonDismissableError: false,
  }

  onSimulateDismissableError = () => {
    this.setState({ hasDismissableError: true });
  }

  onSimulateNonDismissableError = () => {
    this.setState({ hasNonDismissableError: true });
  }

  onSimulateMultipleButtonsError = () => {
    this.setState({ hasMultipleButtonsError: true });
  }

  render() {
    const { hasDismissableError, hasNonDismissableError, hasMultipleButtonsError } = this.state;

    return (
      <div>
        <h1>Notification</h1>
        <Row>
          <Column>
            <ComponentDemo title="Multiple action buttons" vertical>
              <div className="notification__container fixed-height">
                <div className="notification__content centered-column">
                  <Button
                    disabled={hasMultipleButtonsError}
                    onClick={this.onSimulateMultipleButtonsError}
                  >
                    Simulate Error!
                  </Button>
                </div>
                { hasMultipleButtonsError && (
                  <Notification
                    title="Buttons!"
                    description="Press my buttons."
                    showCountdown
                    buttons={[
                      { label: 'Lorem Ipsum', action: () => alert('Lorem Ipsum?') },
                      { label: 'Dolor Sit 🦄', action: dismiss => dismiss() },
                    ]}
                  />
                ) }
              </div>
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <Column full>
            <ComponentDemo title="Dismissable and overlayed" vertical>
              <div className="notification__container">
                <div className="notification__content">
                  <Button
                    disabled={hasDismissableError}
                    onClick={this.onSimulateDismissableError}
                  >
                    Simulate Error!
                  </Button>
                  <p>Cupidatat amet dolor incididunt consequat nisi labore. Laboris reprehenderit cupidatat sint
                  tempor id culpa nisi commodo voluptate labore elit sint. Pariatur sint exercitation non proident
                  deserunt consectetur non ipsum aliqua in do ex cupidatat anim est officia. Ipsum dolore laboris
                  enim officia labore pariatur volexcepteur Lorem occaecat nisi pariatur minim commodo labore.
                  </p>
                </div>
                { hasDismissableError && (
                  <Notification
                    title="Borked!"
                    description="Dismiss me please."
                    overlay
                    dismissable
                  />
                ) }
              </div>
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <Column>
            <ComponentDemo title="Non-dismissable and not overlayed" vertical>
              <div className="notification__container fixed-height">
                <div className="notification__content centered-column">
                  <Button
                    disabled={hasNonDismissableError}
                    onClick={this.onSimulateNonDismissableError}
                  >
                    Simulate Error!
                  </Button>
                </div>
                { hasNonDismissableError && (
                  <Notification
                    title="Error!"
                    description="I'll dissmiss automatically in 5 seconds."
                  />
                ) }
              </div>
            </ComponentDemo>
          </Column>
        </Row>
        <Row>
          <PropsTable component={Notification} />
        </Row>
      </div>
    );
  }
}

export default BadgeComponentsPage;
