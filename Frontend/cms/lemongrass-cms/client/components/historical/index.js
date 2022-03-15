import React from 'react'
import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate'
import HistoricalRow from './historicalRow'
import HistoricalFormSearch from './historicalFormSearch'
import ErrorsPage from '../lib/errors'

const propTypes = {
  settingLang: PropTypes.shape({}),
  data: PropTypes.shape({}),
  dataSearch: PropTypes.shape({}),
  responsePublish: PropTypes.shape({}),
  updateHistoricalData: PropTypes.func,
  fetchHistoricalData: PropTypes.func,
  isSuccess: PropTypes.bool,
  page: PropTypes.number,
}

const defaultProps = {
  settingLang: {},
  data: {},
  dataSearch: {},
  responsePublish: {},
  updateHistoricalData: () => { },
  fetchHistoricalData: () => { },
  isSuccess: true,
  page: 1,
}

class Historical extends React.Component {
  constructor(props) {
    super(props)
    const { dataSearch } = this.props
    this.handlePageClick = this.handlePageClick.bind(this)
    this.handleChangeField = this.handleChangeField.bind(this)
    this.submitForm = this.submitForm.bind(this)
    this.state = {
      database: dataSearch.database,
    }
  }

  handlePageClick(pageNumber) {
    const { updateHistoricalData, fetchHistoricalData } = this.props
    updateHistoricalData({ page: pageNumber.selected + 1 })
    fetchHistoricalData()
  }

  handleChangeField(event) {
    const { target } = event
    const { dataSearch, updateHistoricalData } = this.props
    const value = target.type === 'checkbox' ? target.checked : target.value
    dataSearch[target.name] = value
    updateHistoricalData({ dataSearch })
    if (target.name === 'database') {
      this.setState({
        database: value,
      })
    }
  }

  submitForm() {
    const { fetchHistoricalData, updateHistoricalData } = this.props
    updateHistoricalData({ page: 1 })
    fetchHistoricalData()
  }
  /*eslint-disable */
  render() {
    const {
      data, isSuccess, settingLang, errorInfo, page,
    } = this.props
    const { database } = this.state
    return (
      isSuccess
        ? (
          <div>
            {/* <h1 className='p-3'>Historical</h1> */}
            <HistoricalFormSearch
              onChange={this.handleChangeField}
              submitForm={this.submitForm}
              langsOption={settingLang}
              database={database}
            />
            <div className="table-responsive p-3">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Database</th>
                    <th>Action</th>
                    <th>User</th>
                    <th>String change</th>
                    <th>Date change</th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(item => <HistoricalRow key={item.id} id={item.id} item={item} />)}
                </tbody>
              </table>
              { data.total > 0
          && (
            <ReactPaginate
              previousLabel={'<'}
              nextLabel={'>'}
              breakLabel="..."
              breakClassName="break-me"
              pageCount={Math.ceil(data.total / 10)}
              marginPagesDisplayed={3}
              pageRangeDisplayed={3}
              onPageChange={this.handlePageClick}
              containerClassName="pagination"
              subContainerClassName="pages pagination"
              activeClassName="active"
              forcePage={page-1}
            />
          )
              }
            </div>
          </div>
        )
        : <ErrorsPage errorInfo={errorInfo} />
    )
  }
}

Historical.propTypes = propTypes
Historical.defaultProps = defaultProps

export default Historical
