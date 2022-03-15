import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import scrollTo from 'scroll-to';

import { getScrollPosition, willScroll } from '../../../utilities';


const propTypes = {
  routing: PropTypes.shape({}),
  screenAvailHeight: PropTypes.number,
};

const defaultProps = {
  routing: {},
  screenAvailHeight: 0,
};

class Anchor extends React.Component {
  constructor(props) {
    super(props);

    this.anchorElement = null;
  }
  componentWillReceiveProps(nextProps) {
    const { routing } = nextProps;
    if (routing.locationBeforeTransitions) {
      setTimeout(() => {
        if (willScroll(this.anchorElement, nextProps.screenAvailHeight)) {
          scrollTo(0, getScrollPosition(this.anchorElement), { duration: 200 });
        }
      }, 0);
    }
  }
  render() {
    return (
      <div ref={(el) => { this.anchorElement = el; }} className="anchor" />
    );
  }
}

Anchor.propTypes = propTypes;
Anchor.defaultProps = defaultProps;

const mapStateToProps = state => ({
  routing: state.routing,
  screenAvailHeight: state.app.screenAvailHeight,
});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(Anchor);
