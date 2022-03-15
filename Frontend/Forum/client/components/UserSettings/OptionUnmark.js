import React from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  onChange: PropTypes.func,
  selectedOption: PropTypes.bool,
};

const defaultProps = {
  onChange: () => { },
  selectedOption: false,
};

class OptionUnmark extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    const selectedVal = e.target.value === 'true';
    if (this.props.onChange) {
      this.props.onChange(selectedVal);
    }
  }

  render() {
    const { selectedOption } = this.props;
    return (
      <div className="bn_user-settings__topic">
        <h2 className="bn_user-settings__sub-headline">Automatiskt avmarkera?</h2>
        <div className="bn_user-settings__wrapper">
          <h4 className="bn_user-settings__wrapper__title">Automagisk avmarkera</h4>
          <p>
            Börssnack avmarkerar själv och visar de inlägg som tillkommit sedan du senast loggade in som nya
          </p>
          <div className="mb">
            <label htmlFor="autoUnmark">Automatisk avmarkera</label>
            <input
              type="radio"
              id="autoUnmark"
              value="true"
              checked={selectedOption === true}
              onChange={this.handleOnChange}
            />
          </div>
          <h4 className="bn_user-settings__wrapper__title">Manuell avmarkera</h4>
          <p>Du måste själv använda knappen &quot;Avmarkera&quot; för att &quot;få bort&quot; nya inlägg. Var noga med
                        att avmarkera när du läst igenom inläggen, annars finns risken att du får upp tusentals
                        nya inlägg varje gång du går till ett möte.
          </p>
          <div>
            <label htmlFor="manualUnmark">Manuell avmarkera</label>
            <input
              type="radio"
              id="manualUnmark"
              value="false"
              checked={selectedOption === false}
              onChange={this.handleOnChange}
            />
          </div>
        </div>
      </div>
    );
  }
}

OptionUnmark.propTypes = propTypes;
OptionUnmark.defaultProps = defaultProps;

export default OptionUnmark;
