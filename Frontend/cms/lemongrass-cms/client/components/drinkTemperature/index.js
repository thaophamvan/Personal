import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'
import ReactPaginate from 'react-paginate'
import ButtonElec from '../lib/button'
import DrinkTemperatureRow from './drinkTemperatureRow'
import {
  fetchDrinkTemperatureData,
  deleteDrinkTemperature,
} from '../../actions/drinkTemperature'
import ModalConfirmation from '../lib/modal'
import ErrorsPage from '../lib/errors'

const propTypes = {
  fetchDrinkTemperatureData: PropTypes.func,
  deleteDrinkTemperature: PropTypes.func,
  deleteRow: PropTypes.func,
  isSuccess: PropTypes.bool,
  data: PropTypes.shape({}),
  lang: PropTypes.string,
}

const defaultProps = {
  fetchDrinkTemperatureData: () => { },
  deleteDrinkTemperature: () => { },
  deleteRow: () => { },
  isSuccess: true,
  data: {},
  lang: '',
}
/*eslint-disable */
class DrinkTemperature extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isOpenModal: false,
      id: -1,
      name: '',
    }
    this.deleteRow = this.deleteRow.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.handlePageClick = this.handlePageClick.bind(this)
    this.confirmation = this.confirmation.bind(this)
  }

  handlePageClick(pageNumber) {
    const { fetchDrinkTemperatureData } = this.props
    fetchDrinkTemperatureData(pageNumber.selected + 1)
  }

  closeModal() {
    this.setState({ isOpenModal: false })
  }

  confirmation() {
    const { deleteRow } = this.props
    const { id } = this.state
    deleteRow(id)
    this.setState({ isOpenModal: false })
  }

  deleteRow(id, name) {
    this.setState({
      isOpenModal: true,
      id,
      name,
    })
  }

  render() {
    const {
      isSuccess, data, lang, errorInfo,
    } = this.props
    const { isOpenModal, name } = this.state
    return (
      isSuccess
        ? (
          <div style={{ padding: 20 }}>
            {/* <h1>
      <Trans i18nKey="DRINK_TEMPERATURE">
                </Trans>
      </h1> */}

            <Link to="/drink-temperature/new" className="pt-3 float-right mr-5">
              <ButtonElec icon="fa fa-plus-square btn-add__icon" className="m-0 btn-add">
                <Trans i18nKey="ADD_NEW" />
              </ButtonElec>
            </Link>
            <ModalConfirmation
              isOpenModal={isOpenModal}
              confirmation={this.confirmation}
              closeModal={this.closeModal}
              name={name}
            />
            <div className="table-responsive">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>
                      <Trans i18nKey="NAME" />
                    </th>
                    <th>
                      <Trans i18nKey="DESCRIPTION" />
                    </th>
                    <th>
                      <Trans i18nKey="DESIRED_TEMPERATURE" />
                    </th>
                    <th style={{ width: 170 }}>
                      <Trans i18nKey="ACTION" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(item => (
                    <DrinkTemperatureRow
                      key={item.id}
                      {...item[lang]}
                      id={item.id}
                      deleteRow={this.deleteRow}
                    />
                  ))}
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

DrinkTemperature.propTypes = propTypes
DrinkTemperature.defaultProps = defaultProps

const mapStateToProps = store => ({
  lang: store.language,
})

const mapDispatchToProps = {
  fetchDrinkTemperatureData,
  deleteDrinkTemperature,
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrinkTemperature)
