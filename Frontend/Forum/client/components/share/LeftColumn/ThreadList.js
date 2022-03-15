import React from 'react';
import PropTypes from 'prop-types';

import ThreadItem from './ThreadItem';

const propTypes = {
  Threads: PropTypes.arrayOf(PropTypes.shape({
  })),
  selectedThread: PropTypes.number,
  authorClicked: PropTypes.func,
  selectedForum: PropTypes.string,
};

const defaultProps = {
  Threads: [],
  selectedThread: 0,
  authorClicked: () => {},
  selectedForum: '',
};

const ThreadList = ({ Threads, selectedThread, authorClicked, selectedForum }) => (
  <div className="bn_thread">
    <div id="threadsList" className="bn_thread__scroll">
      <ul className="bn_thread__list">
        {
          Threads.map(thread => (
            <ThreadItem
              isMarked={selectedThread === thread.ThreadId}
              key={thread.ThreadId}
              {...thread}
              authorClicked={authorClicked}
              selectedForum={selectedForum}
            />
          ))
        }
      </ul>
    </div>
  </div>
);

ThreadList.propTypes = propTypes;
ThreadList.defaultProps = defaultProps;

export default ThreadList;
