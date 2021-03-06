import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import scrollTo from 'scroll-to';

import TopBar from './TopBar';
import ThreadList from './ThreadList';
import Paging from '../Paging';
import Help from '../Help';
import EmptyThread from './EmptyThread';
import LeftColumnLoadingIcon from './LeftColumnLoadingIcon';
import IfComponent from '../IfComponent';

import {
  goToPageLeftColumn,
  refreshLeftColumn,
  changeFilterLeftColumn,
  markThreadsAsRead,
  changeOrderBy,
} from '../../../actions';
import { validateAuthorization, getScrollPosition } from '../../../utilities';

const propTypes = {
  Threads: PropTypes.arrayOf(PropTypes.shape({
  })),
  selectedThread: PropTypes.number,
  currentPage: PropTypes.number,
  authorClicked: PropTypes.func,
  goToPage: PropTypes.func,
  totalPages: PropTypes.number,
  selectedForum: PropTypes.string,
  hasAccess: PropTypes.bool,
  refreshClicked: PropTypes.func,
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
  markAsReadClicked: PropTypes.func,
  filterChanged: PropTypes.func,
  filterOptions: PropTypes.arrayOf(PropTypes.shape({})),
  selectedFilter: PropTypes.string,
  orderBy: PropTypes.string,
  isLoaded: PropTypes.bool,
  isMobileMode: PropTypes.bool,
  orderByOnChange: PropTypes.func,
};

const defaultProps = {
  Threads: [],
  selectedThread: null,
  selectedForum: '',
  currentPage: 0,
  authorClicked: () => { },
  goToPage: () => { },
  totalPages: 0,
  columnHeight: 0,
  hasAccess: false,
  markAsReadClicked: () => { },
  refreshClicked: () => { },
  history: {},
  filterChanged: () => { },
  filterOptions: [],
  selectedFilter: '',
  orderBy: 'LatestThread',
  isLoaded: false,
  isMobileMode: false,
  orderByOnChange: () => { },
};

class LeftColumn extends React.Component {
  constructor(props) {
    super(props);
    this.setupState = this.setupState.bind(this);
    this.toogleHelp = this.toogleHelp.bind(this);
    this.onNewThreadClicked = this.onNewThreadClicked.bind(this);
    this.leftWrapper = null;
    this.setupState();
  }

  onNewThreadClicked() {
    const { hasAccess, selectedForum, history } = this.props;
    if (hasAccess) {
      history.push(`/newthread/${selectedForum}`);
    }
  }
  setupState() {
    const showHelp = false;
    this.state = { showHelp };
  }
  toogleHelp() {
    const { showHelp } = this.state;
    this.setState({
      showHelp: !showHelp,
    });
  }
  render() {
    const { totalPages, Threads, currentPage, hasAccess, filterChanged, filterOptions, markAsReadClicked,
      selectedThread, authorClicked, goToPage, selectedForum, refreshClicked, selectedFilter, orderBy,
      isLoaded, isMobileMode, orderByOnChange } = this.props;
    const { showHelp } = this.state;
    return (
      <div className="bn_column__left">
        <div
          className="bn_column-left__wrapper"
          ref={(el) => { this.leftWrapper = el; }}
        >
          <TopBar
            refreshClicked={refreshClicked}
            hasAccess={hasAccess}
            infoClicked={this.toogleHelp}
            newThreadClicked={this.onNewThreadClicked}
            filterOptions={filterOptions}
            selectedFilter={selectedFilter}
            filterChanged={filterChanged}
            threadCount={Threads.length}
            markAsReadClicked={markAsReadClicked}
            orderByType={orderBy}
            orderByOnChange={orderByOnChange}
          />
          <LeftColumnLoadingIcon />
          <IfComponent
            condition={Threads.length > 0}
            whenTrue={(
              <ThreadList
                selectedForum={selectedForum}
                selectedThread={selectedThread}
                Threads={Threads}
                authorClicked={authorClicked}
              />
            )}
            whenFalse={(
              <IfComponent
                condition={isLoaded}
                whenTrue={<EmptyThread isMobile={isMobileMode} />}
                whenFalse={null}
              />
            )}
          />

          <Paging
            goToPage={(page) => { goToPage(page, this.leftWrapper); }}
            currentThreadIndex={currentPage}
            totalPages={totalPages}
          />
          <Help showHelp={showHelp} title="S?? fungerar tr??dlistan" onCloseClicked={this.toogleHelp}>
            <p>H??r kan du se rubriken f??r varje tr??d i forumet.
              Listan ??r f??rinst??lld att visa de tr??dar som skapats under dagen.</p>
            <p><strong>1) S?? h??r skapar du en tr??d:</strong></p>
            <p>Du m??ste vara registrerad anv??ndare och inloggad.
              Klicka p?? pennsymbolen l??ngst till v??nster f??r att skapa en ny tr??d,
              skriv en kort och informativ rubrik. Ta g??rna en extra titt s?? att inte en tr??d f??r ditt ??mne ???
              till exempel dagens b??rsutveckling ??? redan ??r skapad.&nbsp;
              N??r du har tryckt p?? publiceraknappen visas den nya tr??den i tr??dlistan,
              och andra b??rssnackare kan fylla p?? med kommentarer.&nbsp;</p>
            <p><strong>2) S?? h??r sorterar du tr??dar:</strong></p>
            <p>Anv??nd rullistan f??r att sortera hur tr??dlistan ska visas.
              <strong>???Ol??st???</strong> visar tr??dar som skapats sedan du senast markerade tr??dlistan som l??st.
              Det g??r du genom att klicka p?? kugghjulssymbolen till h??ger om rullistan.
              <strong>???Tr??dar jag f??ljer???</strong> visar tr??dar du bevakar. F??r att l??gga till en tr??d, klicka p??
              <strong>???F??lj denna tr??d???</strong> i kommentarslistan. <strong>???Favoritskribenter???</strong>
              visar tr??dar som skapats av b??rssnackare du f??ljer. Det g??r du p?? b??rssnackarens anv??ndarsida,
              som du hittar antingen genom att klicka p?? b??rssnackarens namn
              i en kommentar eller tr??d, eller genom s??ket.
              <strong>???Skrivet av mig???</strong> visar tr??dar du sj??lv skapat. <strong>???Dagens hetaste tr??dar???</strong>
              visar de tr??dar som genererat flest kommentarer. <strong>???Mest gillat???</strong>
              visar de tr??dar d??r flest b??rssnackare gillat en kommentar.
              <strong>Tips!</strong> Anv??nd <strong>???Markera som l??st???</strong>
              efter att ha l??st igenom tr??dar och kommentarer du ??r intresserad av.
              Efter det anv??nder du <strong>???Ol??st???</strong>
              f??r att se nya tr??dar vartefter de skapas. Detta ger en betydande prestandaf??rb??ttring.
            </p>
          </Help>
        </div>
      </div>
    );
  }
}

LeftColumn.propTypes = propTypes;
LeftColumn.defaultProps = defaultProps;

const mapStateToProps = state => ({
  Threads: state.leftColumn.Threads,
  currentPage: state.leftColumn.currentPage,
  selectedThread: state.leftColumn.selectedThread,
  totalPages: state.leftColumn.totalPages,
  selectedForum: state.app.selectedForum,
  leftColumn: state.leftColumn,
  columnHeight: state.app.columnHeight,
  hasAccess: validateAuthorization(state.app.credentials),
  filterOptions: state.leftColumn.filterOptions,
  selectedFilter: state.leftColumn.selectedFilter,
  orderBy: state.leftColumn.orderBy,
  isLoaded: !state.loading.isLoadingLeftColumn,
  isMobileMode: state.app.isMobileMode,
});


const mapDispatchToProps = dispatch => ({
  goToPage: (page, scrollElement) => {
    scrollTo(0, getScrollPosition(scrollElement), { duration: 200 });
    dispatch(goToPageLeftColumn(page, location));
  },
  refreshClicked: () => {
    dispatch(refreshLeftColumn(location));
  },
  filterChanged: (option) => {
    dispatch(changeFilterLeftColumn(option.value, location));
  },
  markAsReadClicked: () => {
    dispatch(markThreadsAsRead(location));
  },
  orderByOnChange: (orderByType) => {
    dispatch(changeOrderBy(orderByType, location));
  },
});

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(LeftColumn));
