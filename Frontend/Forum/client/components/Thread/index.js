import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ContentThread from './ContentThread';
import EmptyThread from './EmptyThread';
import { IfComponent, LoadingAnimationComponent } from '../share';

const propTypes = {
  isEmpty: PropTypes.bool,
};

const defaultProps = {
  isEmpty: false,
};

const Thread = ({ isEmpty }) => (
  <LoadingAnimationComponent>
    <IfComponent
      condition={isEmpty}
      whenTrue={<EmptyThread />}
      whenFalse={<ContentThread />}
    />
  </LoadingAnimationComponent>
);

Thread.propTypes = propTypes;
Thread.defaultProps = defaultProps;

const mapStateToProps = state => ({
  isEmpty: state.mainTopic.Thread === null,
});

const mapDispatchToProps = state => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(Thread);
