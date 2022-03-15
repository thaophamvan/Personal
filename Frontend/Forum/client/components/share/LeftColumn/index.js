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
          <Help showHelp={showHelp} title="Så fungerar trådlistan" onCloseClicked={this.toogleHelp}>
            <p>Här kan du se rubriken för varje tråd i forumet.
              Listan är förinställd att visa de trådar som skapats under dagen.</p>
            <p><strong>1) Så här skapar du en tråd:</strong></p>
            <p>Du måste vara registrerad användare och inloggad.
              Klicka på pennsymbolen längst till vänster för att skapa en ny tråd,
              skriv en kort och informativ rubrik. Ta gärna en extra titt så att inte en tråd för ditt ämne –
              till exempel dagens börsutveckling – redan är skapad.&nbsp;
              När du har tryckt på publiceraknappen visas den nya tråden i trådlistan,
              och andra börssnackare kan fylla på med kommentarer.&nbsp;</p>
            <p><strong>2) Så här sorterar du trådar:</strong></p>
            <p>Använd rullistan för att sortera hur trådlistan ska visas.
              <strong>“Oläst”</strong> visar trådar som skapats sedan du senast markerade trådlistan som läst.
              Det gör du genom att klicka på kugghjulssymbolen till höger om rullistan.
              <strong>“Trådar jag följer”</strong> visar trådar du bevakar. För att lägga till en tråd, klicka på
              <strong>“Följ denna tråd”</strong> i kommentarslistan. <strong>“Favoritskribenter”</strong>
              visar trådar som skapats av börssnackare du följer. Det gör du på börssnackarens användarsida,
              som du hittar antingen genom att klicka på börssnackarens namn
              i en kommentar eller tråd, eller genom söket.
              <strong>“Skrivet av mig”</strong> visar trådar du själv skapat. <strong>“Dagens hetaste trådar”</strong>
              visar de trådar som genererat flest kommentarer. <strong>“Mest gillat”</strong>
              visar de trådar där flest börssnackare gillat en kommentar.
              <strong>Tips!</strong> Använd <strong>“Markera som läst”</strong>
              efter att ha läst igenom trådar och kommentarer du är intresserad av.
              Efter det använder du <strong>“Oläst”</strong>
              för att se nya trådar vartefter de skapas. Detta ger en betydande prestandaförbättring.
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
