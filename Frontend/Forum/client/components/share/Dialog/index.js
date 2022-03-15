import React from 'react';
import PropTypes from 'prop-types';

import CloseButton from '../CloseButton';
import IfComponent from '../IfComponent';
import './dialog.scss';

const propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  children: PropTypes.node,
  onCloseClicked: PropTypes.func,
  isVisible: PropTypes.bool,
};

const defaultProps = {
  className: '',
  title: '',
  children: '',
  onCloseClicked: () => {},
  isVisible: false,
};

let dialogContent = null;

const overlayClicked = (evt, closeClicked) => {
  if (!dialogContent.contains(evt.target)) {
    closeClicked(evt);
  }
};

const preventScrollWhenVisible = (isVisible) => {
  const htmlDom = document.getElementsByTagName('html')[0];
  if (isVisible) {
    htmlDom.classList.add('is-clipped');
  } else {
    htmlDom.classList.remove('is-clipped');
  }
};

const Dialog = ({ className, title, children, onCloseClicked, isVisible }) => {
  preventScrollWhenVisible(isVisible);
  return (
    <IfComponent
      condition={isVisible}
      whenTrue={(
        <div
          className={`bn_help-box active ${className}`}
        >
          <div
            className="bn_help-box__overlay"
            onClick={(evt) => { overlayClicked(evt, onCloseClicked); }}
            role="button"
            tabIndex="-1"
          />
          <div
            role="button"
            className="bn_help-box__holder bn_display-flex"
            tabIndex="-1"
            ref={(el) => { dialogContent = el; }}
          >
            <div className="bn_help-box__wrapper bn_display-flex">
              <div className="bn_help-box-header clearfix">
                <span className="bn_help-box-header__text">{title}</span>
                <div className="bn_right">
                  <CloseButton
                    onClick={onCloseClicked}
                    className="bn_help-box-header__close"
                  />
                </div>
              </div>
              <div className="bn_help-box-body">
                {(children)}
              </div>
            </div>
          </div>
        </div>
      )}
      whenFalse={null}
    />
  );
};


Dialog.propTypes = propTypes;
Dialog.defaultProps = defaultProps;

export default Dialog;
