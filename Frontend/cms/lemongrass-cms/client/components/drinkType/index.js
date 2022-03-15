import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Trans } from 'react-i18next'
import ReactPaginate from 'react-paginate'
import { connect } from 'react-redux'
import ModalConfirmation from '../lib/modal'
import ButtonElec from '../lib/button'
import DrinkTypeRow from './drinkTypeRow'
import {
  fetchDrinkTypeData,
  deleteDrinkType,
} from '../../actions/drinkType'
import ErrorsPage from '../lib/errors'

const propTypes = {
  data: PropTypes.shape(),
  fetchDrinkTypeData: PropTypes.func,
  deleteDrinkType: PropTypes.func,
  deleteRow: PropTypes.func,
  isSuccess: PropTypes.bool,
  lang: PropTypes.string,
}

const defaultProps = {
  data: {},
  fetchDrinkTypeData: () => { },
  deleteDrinkType: () => { },
  deleteRow: () => { },
  isSuccess: true,
  lang: '',
}

class DrinkType extends React.Component {
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
  /*eslint-disable */
  handlePageClick(pageNumber) {
    const { fetchDrinkTypeData } = this.props
    fetchDrinkTypeData(pageNumber.selected + 1)
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
          <div>
            {/* <h1 className='p-3'>
          <Trans i18nKey="DRINK_TYPE">
          </Trans></h1> */}

            <Link to="/drink-type/new" className="pt-3 float-right mr-5">
              <ButtonElec icon="fa fa-plus-square btn-add__icon" className="m-0 btn-add">
                <Trans i18nKey="ADD_NEW">
              Add new
                </Trans>
              </ButtonElec>
            </Link>
            <ModalConfirmation
              isOpenModal={isOpenModal}
              confirmation={() => this.confirmation}
              closeModal={this.closeModal}
              name={name}
            />
            <div className="table-responsive p-3">
              <table className="table table-striped table-sm">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>
                      <Trans i18nKey="NAME" />
                    </th>
                    <th>
                      <Trans i18nKey="TYPE" />
                    </th>
                    <th>
                      <Trans i18nKey="DESCRIPTION" />
                    </th>
                    <th>
                      <Trans i18nKey="HEIGHT" />
                    </th>
                    <th>
                      <Trans i18nKey="DIAMETER" />
                    </th>
                    <th>
                      <Trans i18nKey="VOLUME" />
                    </th>
                    <th style={{ width: 170 }}>
                      <Trans i18nKey="ACTION" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(item => (
                    <DrinkTypeRow
                      key={item.id}
                      {...item[lang]}
                      id={item.id}
                      deleteRow={this.deleteRow}
                    />
                  ))}
                </tbody>
              </table>
              {data.total > 0
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

DrinkType.propTypes = propTypes
DrinkType.defaultProps = defaultProps

const mapStateToProps = store => ({
  lang: store.language,
})

const mapDispatchToProps = {
  fetchDrinkTypeData,
  deleteDrinkType,
}


export default connect(mapStateToProps, mapDispatchToProps)(DrinkType)
