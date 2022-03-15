import React from 'react';

import { InfoButton, Help, TopBar as SharedTopBar } from '../share';

const propTypes = {
};

const defaultProps = {
};

class TopBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelp: false,
    };
    this.toggleHelp = this.toggleHelp.bind(this);
  }
  toggleHelp() {
    const { showHelp } = this.state;
    this.setState({
      showHelp: !showHelp,
    });
  }
  render() {
    const { showHelp } = this.state;
    return (
      <SharedTopBar className="bn_topbar--blue">
        <span className="bn_topbar__label">Ny tråd</span>
        <InfoButton title="Så fungerar kommentarslistan" onClick={this.toggleHelp} />
        <Help onCloseClicked={this.toggleHelp} showHelp={showHelp} title="Så fungerar kommentarslistan">
          <h2>Så skapar du en tråd</h2>
          <span>Du måste vara registrerad användare och inloggad.
                        Att skapa ett konto är gratis.Klicka på pennsymbolen längst
                        till vänster för att skapa en ny tråd, skriv en kort och informativ rubrik.
                        Ta gärna en extra titt så att inte en tråd för ditt ämne
                        - till exempel dagens börsutveckling
                        - redan är skapad.När du har tryckt på publicera-knappen visas den
                        nya tråden i trådlistan, och andra börssnackare kan
                        fylla på med kommentarer i den bredaste kolumnen.
          </span>
        </Help>
      </SharedTopBar>
    );
  }
}

TopBar.propTypes = propTypes;
TopBar.defaultProps = defaultProps;

export default TopBar;
