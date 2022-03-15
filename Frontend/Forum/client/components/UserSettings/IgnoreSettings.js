import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import remove from 'lodash/remove';

import { removeIgnore } from '../../actions';
import TableSettings from './TableSettings';
import { BackButton } from '../share';

const propTypes = {
  history: PropTypes.shape({}),
  ignores: PropTypes.arrayOf(PropTypes.shape({})),
  onRemoveIgnore: PropTypes.func,
};

const defaultProps = {
  history: {},
  ignores: [],
  onRemoveIgnore: () => { },
};

class IgnoreSettings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ignoreSettings: [],
    };
    this.removeIgnore = this.removeIgnore.bind(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.ignores) {
      this.state = { ignoreSettings: nextProps.ignores };
    }
  }
  removeIgnore(userId) {
    const ignoreSettings = [...this.state.ignoreSettings];
    remove(ignoreSettings, {
      Id: userId,
    });
    this.props.onRemoveIgnore(userId);
    this.setState({ ignoreSettings });
  }
  render() {
    const { ignoreSettings } = this.state;
    const { history } = this.props;
    return (
      <div>
        <h1 className="user-settings__headline">Mina ignorerade användare</h1>
        <div className="favIgnoreWrapper user-ignore">
          <p className="user-ignore__text">
            För att slippa läsa en användares inlägg kan du lägga till denna på din lista över ignorerade användare.
            Detta gör du genom att klicka på användarens namn
            och därefter på &quot;Lägg till i Ignorerade användare&quot;.
            Du filtrerar nu bort dennes inlägg. Du har dock alltid möjlighet att visa dessa
            genom att klicka på &quot;Visa&quot; efter användarens inlägg.
          </p>
          <TableSettings items={ignoreSettings} onClick={this.removeIgnore} />
          <div className="user-settings__wrapper">
            <h2 className="user-settings__sub-headline">
              Du är själv ignorerad av 0 användare
            </h2>
            <p>Lägg till användare till ignoreralistan genom att använda sökfunktionen nedan.
                Du kan också göra det från varje användares användarinfo.
            </p>
          </div>
        </div>
        <BackButton onClick={() => history.push('/usersettings')} />
      </div>
    );
  }
}

IgnoreSettings.propTypes = propTypes;
IgnoreSettings.defaultProps = defaultProps;

const mapStateToProps = state => ({
  ignores: state.user.ignores,
});

const mapDispatchToProps = dispatch => ({
  onRemoveIgnore: (userId) => {
    dispatch(removeIgnore(userId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(IgnoreSettings);
