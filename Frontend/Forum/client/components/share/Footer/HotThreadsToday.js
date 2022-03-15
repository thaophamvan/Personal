import React from 'react';
import PropTypes from 'prop-types';

import HotThreads from './HotThreads';
import Help from '../Help';

const propTypes = {
  statisticThreads: React.PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    date: PropTypes.string,
    link: PropTypes.string,
    count: PropTypes.number,
  })),
  refreshClicked: PropTypes.func,
};

const defaultProps = {
  statisticThreads: [],
  refreshClicked: () => { },
};

class HotThreadsToday extends React.Component {
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
        boxName="Hetast i dag"
        className="bn_statistic__today"
        infoText="Här hittar du de mest lästa trådarna"
        statisticThreads={statisticThreads}
        infoClicked={this.toggleInfo}
        refreshClicked={refreshClicked}
      >
        <Help
          title="Här hittar du de mest lästa trådarna"
          onCloseClicked={this.toggleInfo}
          showHelp={showHelp}
        >
          <h2>Så använder du hetaste trådarna</h2>
          <p>Här kan du se vilka trådar som genererat flest kommentarer under dagen.</p>
        </Help>
      </HotThreads>
    );
  }
}

HotThreadsToday.propTypes = propTypes;
HotThreadsToday.defaultProps = defaultProps;

export default HotThreadsToday;
