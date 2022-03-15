import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button/button';

export default class Notification extends React.Component {
  static propTypes = {
    buttons: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string.isRequired,
      action: PropTypes.func.isRequired,
    })),
    description: PropTypes.string,
    dismissable: PropTypes.bool,
    dismissTimeout: PropTypes.number,
    onDismiss: PropTypes.func,
    overlay: PropTypes.bool,
    showCountdown: PropTypes.bool,
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['danger', 'info']),
  }

  static defaultProps = {
    dismissable: false,
    dismissTimeout: 5,
    onDismiss: () => {},
    overlay: false,
    showCountdown: false,
    type: 'danger',
    description: '',
    buttons: [],
  };

  static propDescriptions = {
    buttons: 'A list of custom buttons. Each action callback will receive the dismiss function for actually dismissing the notification. Fields: label (string), action (callback function)',
    overlay: 'Render the notification "on top of" it\'s parent',
    type: 'Allowed values are "info" and "danger"',
    dismissable: 'Makes it possible for the user to manually dismiss this notification',
    showCountdown: 'Visually give the user feedback of how much longer this notification will show',
    onDismiss: 'Function that will be called as the notification is dismissed',
    dismissTimeout: 'A number which indicates the amount of seconds to show this notification before dismissing it',
  }

  constructor(props) {
    super(props);

    this.countdownTimer = null;
    this.startAnimationTimer = null;

    this.state = {
      hidden: true,
      secondsLeft: Math.ceil(props.dismissTimeout),
    };
  }

  componentDidMount() {
    this.startAnimationTimer = setTimeout(() => {
      this.setState({ hidden: false });

      const { dismissable } = this.props;

      if (!dismissable) {
        this.countdownTick();
      }
    }, 50);
  }

  componentWillUnmount() {
    clearTimeout(this.dismissTransitionTimeout);
    clearTimeout(this.countdownTimer);
    clearTimeout(this.startAnimationTimer);
  }

  onDismiss = () => {
    this.setState({ hidden: true });

    // CSS transition has a duration of 500ms.
    this.dismissTransitionTimeout = setTimeout(() => {
      this.props.onDismiss();
    }, 500);
  }

  countdownTick = () => {
    const { secondsLeft } = this.state;

    if (secondsLeft > 0) {
      this.setState({ secondsLeft: secondsLeft - 1 });
      this.countdownTimer = setTimeout(this.countdownTick, 1000);
    } else {
      this.onDismiss();
    }
  }

  render() {
    const { hidden, secondsLeft } = this.state;
    const {
      title, description, dismissable, type, overlay, buttons, showCountdown,
    } = this.props;

    const classes = classNames('notification', `notification--${type}`, {
      'notification--hidden': hidden,
      'notification--showing': !hidden,
      'notification--overlay': overlay,
      'notification--non-overlay': !overlay,
    });

    /* eslint-disable no-irregular-whitespace */
    return (
      <div className={classes}>
        <div className="notification__inner">
          <div className="notification__body">
            <strong>{ title }</strong>
            { description && ` – ${description}` }
            { showCountdown && <span className="notification__countdown-value">{ secondsLeft }</span> }
          </div>
          { buttons && buttons.map(button => (
            <Button
              key={button.label}
              type="inverted"
              onClick={() => { button.action(this.onDismiss); }}
            >
              {button.label}
            </Button>
          ))}
          { dismissable && <Button type="inverted" onClick={this.onDismiss}>Avfärda</Button> }
        </div>
      </div>
    );
  }
}
