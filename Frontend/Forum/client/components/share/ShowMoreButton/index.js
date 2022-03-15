import React from 'react';
import PropTypes from 'prop-types';

import MoreButton from './MoreButton';
import { IfComponent } from '../';

const propTypes = {
  moreClicked: PropTypes.func,
  lessClicked: PropTypes.func,
  showMoreDisabled: PropTypes.bool,
  showMoreRemaining: PropTypes.number,
};

const defaultProps = {
  moreClicked: () => {},
  lessClicked: () => {},
  showMoreDisabled: false,
  showMoreRemaining: 0,
};

class ShowMoreButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }
  render() {
    const { moreClicked, lessClicked, showMoreDisabled, showMoreRemaining } = this.props;
    return (
      <li className="cf bn_thread-comment__item bn_thread-comment__item--show">
        <IfComponent
          condition={showMoreDisabled}
          whenTrue={(
            <MoreButton onClick={lessClicked}>
              Visa färre<i className="material-icons">keyboard_arrow_up</i>
            </MoreButton>
          )}
          whenFalse={(
            <MoreButton onClick={moreClicked}>
              Visa alla ({showMoreRemaining})<i className="material-icons">keyboard_arrow_down</i>
            </MoreButton>
          )}
        />
      </li>
    );
  }
}

ShowMoreButton.propTypes = propTypes;
ShowMoreButton.defaultProps = defaultProps;

export default ShowMoreButton;
