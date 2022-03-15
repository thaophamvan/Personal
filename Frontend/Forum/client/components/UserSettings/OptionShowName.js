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

class OptionShowName extends React.Component {
  constructor(props) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }

  handleOnChange(e) {
    const selectedVal = e.target.value === 'true';
    this.props.onChange(selectedVal);
  }

  render() {
    const { selectedOption } = this.props;
    return (
      <div className="bn_user-settings__topic">
        <h2 className="bn_user-settings__sub-headline">Visa namn?</h2>
        <div className="bn_user-settings__wrapper">
          <h4 className="bn_user-settings__wrapper__title">Visa mitt namn</h4>
          <p>
                        Här kan du bestämma om ditt användarnamn skall visas i menyn eller inte.
                        Det är givetvisendast synligt för dig själv.
          </p>
          <div className="mb showName">
            <label htmlFor="showName">Ja</label>
            <input
              type="radio"
              id="showName"
              value="true"
              checked={selectedOption === true}
              onChange={this.handleOnChange}
            />
            <label htmlFor="hideName">Nej</label>
            <input
              type="radio"
              id="hideName"
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

OptionShowName.propTypes = propTypes;
OptionShowName.defaultProps = defaultProps;

export default OptionShowName;
