import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  addIgnore: PropTypes.func,
  removeIgnore: PropTypes.func,
  isIgnore: PropTypes.bool,
};

const defaultProps = {
  addIgnore: () => { },
  removeIgnore: () => { },
  isIgnore: false,
};

class ToggleIgnoreButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isIgnore: props.isIgnore,
    };
    this.addIgnoreClicked = this.addIgnoreClicked.bind(this);
    this.removeIgnoreClicked = this.removeIgnoreClicked.bind(this);
  }

  addIgnoreClicked(e) {
    const isIgnore = !this.state.isIgnore;
    this.props.addIgnore();
    this.setState({ isIgnore });
  }

  removeIgnoreClicked(e) {
    const isIgnore = !this.state.isIgnore;
    this.props.removeIgnore();
    this.setState({ isIgnore });
  }

  render() {
    const removeIgnoreButton = (
      <a
        className="ignore bn_profile-follow__link reset-link"
        role="button"
        tabIndex="-1"
        onClick={this.removeIgnoreClicked}
      >
        <i className="material-icons bn_profile-follow__icon">clear</i>
        Ignorera inte användaren
      </a>
    );

    const ignoreButton = (
      <a
        className="ignore bn_profile-follow__link"
        role="button"
        tabIndex="-1"
        onClick={this.addIgnoreClicked}
      >
        <i className="material-icons bn_profile-follow__icon bn_profile-follow__icon--ignore">block</i>
        Ignorera användaren
      </a>
    );
    const { isIgnore } = this.state;
    return isIgnore ? removeIgnoreButton : ignoreButton;
  }
}

ToggleIgnoreButton.propTypes = propTypes;
ToggleIgnoreButton.defaultProps = defaultProps;

export default ToggleIgnoreButton;
