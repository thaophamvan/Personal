import React from 'react';
import PropTypes from 'prop-types';
import { linkify } from '../../utilities';

const propTypes = {
  infoText: PropTypes.string,
};

const defaultProps = {
  infoText: '',
};

const AboutMe = ({ infoText }) => (
  <div className="aboutMe">
    <h2 className="bn_profile__info">Användarinformation</h2>
    <div dangerouslySetInnerHTML={{
      __html: linkify(infoText),
    }}
    />
  </div>
);

AboutMe.propTypes = propTypes;
AboutMe.defaultProps = defaultProps;

export default AboutMe;
