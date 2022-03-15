import React, { Component } from "react";

import Help from "../Help";
import { setCookie, getCookie } from "../../../utilities";

const propTypes = {};

const defaultProps = {};

class Welcome extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelp: getCookie(".personal_welcome") !== "true",
    };
    this.toggleInfo = this.toggleInfo.bind(this);
    this.onAcceptTermsClick = this.onAcceptTermsClick.bind(this);
  }

  onAcceptTermsClick() {
    this.setState(
      {
        showHelp: false,
      },
      () => {
        setCookie(".personal_welcome", true, 3650);
      }
    );
  }

  toggleInfo() {
    const { showHelp } = this.state;
    this.setState({
      showHelp: !showHelp,
    });
  }

  render() {
    const { showHelp } = this.state;
    return (
      <Help onCloseClicked={this.toggleInfo} showHelp={showHelp}>
        <h2>Välkommen till Börssnack</h2>
        <p>
          Alla ekonomi - och börsintresserade personer är varmt välkomna att delta i diskussionerna på Börssnack, Sveriges
          största mötesplats på nätet för dem som är intresserade av börs, aktieplaceringar, ekonomi och näringsliv.
        </p>
        <p>På Börssnack kan du läsa tusentals nya kommentarer en normal börsdag.</p>
        <p>
          Du väljer själv din signatur och lösenord. Om du redan har ett konto på{" "}
          <a href="http://di.se" rel="noopener noreferrer" target="_blank">
            di.se
          </a>{" "}
          kan du koppla det till Börssnack. Du kan inte använda en signatur som är upptagen av någon annan, vare sig på{" "}
          <a href="http://di.se" rel="noopener noreferrer" target="_blank">
            di.se
          </a>{" "}
          eller Börssnack.{" "}
        </p>
        <p>
          Regler och villkor för dig som vill skriva på Börssnack:
          <br />
          Börssnack är ett fritt forum i den bemärkelsen att det är skribenterna själva som skapar och ansvarar för sina
          kommentarer. Här kan du analysera, kritisera och diskutera. Men skribenterna måste också hålla sig till vissa
          spelregler. Ingen förhandsgranskning av kommentarerna sker. Däremot plockar vi bort sådant som inte följer
          spelreglerna Kommentatorerna är personligen ansvariga för det som postas.
          <br />
          Det är inte tillåtet att försöka manipulera börskurser via Börssnacks forum. På Börssnack accepterar vi inte
        </p>
        <ul>
          <li>svordomar, könsord eller liknande ovårdat språkbruk</li>
          <li>rasistiskt innehåll eller nedsättande omdömen om kön, ras, religion eller liknande.</li>
          <li>kommentarer som utpekar annan person som brottsling, eller uppmaningar till brottslig verksamhet</li>
          <li>grova påhopp och beskyllningar mot andra deltagare i Börssnack</li>
          <li>kommentarer som innehåller kommersiella budskap</li>
        </ul>
        <p>Vänligen respektera detta!</p>
        <p>
          Vi har plockat bort alla strängar som berör invandring, konflikter mellan folkslag och liknande ämnen. Alla nya
          inlägg i dessa ämnen kommer att rensas bort omgående.
        </p>
        <p>Börssnack är i huvudsak ett aktieforum.</p>
        <p>
          Kommentarer som bryter mot någon av dessa regler blir obönhörligt raderade. Skribenten kan också bli avstängd från
          fortsatt diskussion på Börssnack. Det är endast tillåtet med en signatur per person och så kallade
          &quot;ubåtar&quot; (flera signaturer) kommer att bli borttagna. Personal på{" "}
          <a href="http://di.se" rel="noopener noreferrer" target="_blank">
            di.se
          </a>{" "}
          har rätt att radera kommentarer eller användare utan att behöva motivera åtgärden. Deltagarna i Börssnack förväntas
          respektera lagen om upphovsrätt. Det är inte tillåtet att kopiera hela artiklar från andra media för publicering på
          Börssnack. Däremot är det tillåtet att göra korta citat eller sammanfattningar med egna ord. Om du skriver
          kommentarer på Börssnack medger du också att{" "}
          <a href="http://di.se" rel="noopener noreferrer" target="_blank">
            di.se
          </a>{" "}
          utan ersättning får lagra, tillhandahålla och sprida materialet till andra.
        </p>
        <p>När du skriver på Börssnack har du accepterat detta forums regler och villkor.</p>
        <div>
          <a className="bn_header__welcome__close-button" role="button" tabIndex="-1" onClick={this.onAcceptTermsClick}>
            Jag har läst och godkänner villkoren
          </a>
        </div>
      </Help>
    );
  }
}

Welcome.propTypes = propTypes;
Welcome.defaultProps = defaultProps;

export default Welcome;
