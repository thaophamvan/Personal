import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import MainStatistic from './MainStatistic';
import { loadStatistic } from '../../actions';
import { RefreshButton, LoadingAnimationComponent, TopBar } from '../share';

const propTypes = {
  mostUsersToday: PropTypes.arrayOf(PropTypes.shape({})),
  mostUsersWeek: PropTypes.arrayOf(PropTypes.shape({})),
  mostThreadsToday: PropTypes.arrayOf(PropTypes.shape({})),
  mostThreadsWeek: PropTypes.arrayOf(PropTypes.shape({})),
  onLoadStatistic: PropTypes.func,
  menuItems: PropTypes.arrayOf(PropTypes.shape({})),
};

const defaultProps = {
  mostUsersToday: [],
  mostUsersWeek: [],
  mostThreadsToday: [],
  mostThreadsWeek: [],
  onLoadStatistic: () => { },
  menuItems: [],
};

class Statistic extends React.Component {
  constructor(props) {
    super(props);
    this.onRefreshClicked = this.onRefreshClicked.bind(this);
  }
  onRefreshClicked() {
    this.props.onLoadStatistic();
  }
  render() {
    const {
      mostUsersToday,
      mostUsersWeek,
      mostThreadsToday,
      mostThreadsWeek,
      menuItems,
    } = this.props;
    return (
      <LoadingAnimationComponent>
        <div className="bn_statistic-most__page">
          <TopBar className="bn_topbar--blue">
            <RefreshButton onClick={this.onRefreshClicked} />
            <span className="bn_topbar__label">Statistisk</span>
          </TopBar>
          <MainStatistic
            mostUsersToday={mostUsersToday}
            mostUsersWeek={mostUsersWeek}
            mostThreadsToday={mostThreadsToday}
            mostThreadsWeek={mostThreadsWeek}
            menuItems={menuItems}
          />
        </div>
      </LoadingAnimationComponent>
    );
  }
}

Statistic.propTypes = propTypes;
Statistic.defaultProps = defaultProps;

const mapStateToProps = state => ({
  mostUsersToday: state.statistic.mostUsersToday,
  mostUsersWeek: state.statistic.mostUsersWeek,
  mostThreadsToday: state.statistic.mostThreadsToday,
  mostThreadsWeek: state.statistic.mostThreadsWeek,
  menuItems: state.app.menuItems,
});

const mapDispatchToProps = dispatch => ({
  onLoadStatistic: () => dispatch(loadStatistic()),
});
export default connect(mapStateToProps, mapDispatchToProps)(Statistic);
