import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  addFavorite: PropTypes.func,
  removeFavorite: PropTypes.func,
  isFavorite: PropTypes.bool,
};

const defaultProps = {
  addFavorite: () => { },
  removeFavorite: () => { },
  isFavorite: false,
};

class ToggleFavoriteButton extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isFavorite: props.isFavorite,
    };
    this.addFavoriteClicked = this.addFavoriteClicked.bind(this);
    this.removeFavoriteClicked = this.removeFavoriteClicked.bind(this);
  }
  addFavoriteClicked(e) {
    const isFavorite = !this.state.isFavorite;
    this.props.addFavorite();
    this.setState({ isFavorite });
  }
  removeFavoriteClicked(e) {
    const isFavorite = !this.state.isFavorite;
    this.props.removeFavorite();
    this.setState({ isFavorite });
  }
  render() {
    const favoriteButton = (
      <a
        className="bn_profile-follow__link favorite"
        role="button"
        tabIndex="-1"
        onClick={this.addFavoriteClicked}
      >
        <i className="material-icons bn_profile-follow__icon">add_circle</i>
        Lägg till i mina favoriter
      </a>);
    const removeFavoriteButton = (
      <a
        className="favorite bn_profile-follow__link reset-link"
        role="button"
        tabIndex="-1"
        onClick={this.removeFavoriteClicked}
      >
        <i className="material-icons bn_profile-follow__icon">remove_circle</i>
        Ta bort från favoriter
      </a>
    );
    const { isFavorite } = this.state;
    return isFavorite ? removeFavoriteButton : favoriteButton;
  }
}


ToggleFavoriteButton.propTypes = propTypes;
ToggleFavoriteButton.defaultProps = defaultProps;

export default ToggleFavoriteButton;
