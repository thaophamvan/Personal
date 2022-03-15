import React from 'react';
import PropTypes from 'prop-types';

import HotThreads from './HotThreads';
import Help from '../Help';

const propTypes = {
  statisticThreads: React.PropTypes.arrayOf(PropTypes.shape({
  })),
  refreshClicked: PropTypes.func,
};

const defaultProps = {
  statisticThreads: [],
  refreshClicked: () => { },
};

class HotThreadsInWeek extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showHelp: false,
    };
    this.toggleInfo = this.toggleInfo.bind(this);
  }
  toggleInfo() {
    const { showHelp } = this.state;
    this.setState({
      showHelp: !showHelp,
    });
  }
  render() {
    const { statisticThreads, refreshClicked } = this.props;
    const { showHelp } = this.state;
    return (
      <HotThreads
        boxName="Hetast i veckan"
        className="bn_statistic__week"
        infoText="Så använder du hetaste trådarna i veckan"
        statisticThreads={statisticThreads}
        infoClicked={this.toggleInfo}
        refreshClicked={refreshClicked}
      >
        <Help
          title="Så använder du hetaste trådarna i veckan"
          onCloseClicked={this.toggleInfo}
          showHelp={showHelp}
        >
          <h2>Så använder du hetaste trådarna</h2>
          <p>Här kan du se vilka trådar som genererat flest kommentarer under veckan.</p>
        </Help>
      </HotThreads>
    );
  }
}

HotThreadsInWeek.propTypes = propTypes;
HotThreadsInWeek.defaultProps = defaultProps;

export default HotThreadsInWeek;
