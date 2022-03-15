import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import remove from 'lodash/remove';

import { removeFavorite } from '../../actions';
import TableSettings from './TableSettings';
import { BackButton } from '../share';

const propTypes = {
  history: PropTypes.shape({}),
  favorites: PropTypes.shape({}),
  onremoveFavorite: PropTypes.func,
};

const defaultProps = {
  history: {},
  favorites: {},
  onremoveFavorite: () => { },
};

class FavoriteSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favoriteSettings: {},
    };
    this.removeFavorite = this.removeFavorite.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.favorites) {
      this.state = { favoriteSettings: nextProps.favorites };
    }
  }
  removeFavorite(userId) {
    const favoriteSettings = { ...this.state.favoriteSettings };
    remove(favoriteSettings.Favorites, {
      Id: userId,
    });
    this.props.onremoveFavorite(userId);
    this.setState({ favoriteSettings });
  }
  render() {
    const { favoriteSettings } = this.state;
    const { history } = this.props;
    return (
      <div>
        <h1 className="user-settings__headline">Mina favoriter</h1>
        <div className="favIgnoreWrapper user-favorites">
          <p className="user-favorites__text">Du kan lägga till användare till en favoritlista,
            när du väljer detta alternativ under &quot;Välj inlägg&quot; ser
            du bara inlägg eller kommentarer som skrivits av dessa användare.
            Lägg till en användare till favoritlistan genom
            att ta fram dennes AnvändarInfo och klicka på länken
            &quot;Lägg till i mina favoriter&quot; eller &quot;Ta bortfrån
             mina favoriter&quot; om användare redan finns där.</p>
          <TableSettings items={favoriteSettings.Favorites} onClick={this.removeFavorite} />
          <div className="user-settings__wrapper">
            <h2 className="user-settings__sub-headline">
              Du är själv favorit hos {favoriteSettings.FavoritesCount} användare
            </h2>
            <p>Lägg till användare till favoritlistan genom att använda sökfunktionen nedan.
              Du kan också göra det från varje användares användarinfo.
            </p>
          </div>
        </div>
        <BackButton onClick={() => history.push('/usersettings')} />
      </div>
    );
  }
}

FavoriteSettings.propTypes = propTypes;
FavoriteSettings.defaultProps = defaultProps;

const mapStateToProps = state => ({
  favorites: state.user.favorites,
});

const mapDispatchToProps = dispatch => ({
  onremoveFavorite: (userId) => {
    dispatch(removeFavorite(userId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(FavoriteSettings);
