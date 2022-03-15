import React from 'react'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { Trans } from 'react-i18next'
import { connect } from 'react-redux'

import ReactPaginate from 'react-paginate'
import ButtonElec from '../lib/button'
import AutoDoseRow from './autoDoseRow'
import {
  fetchAutoDoseData,
  deleteAutoDose,
} from '../../actions/autoDose'
import ModalConfirmation from '../lib/modal'
import ErrorsPage from '../lib/errors'

const propTypes = {
  fetchAutoDoseData: PropTypes.func,
  deleteAutoDose: PropTypes.func,
  deleteRow: PropTypes.func,
  isSuccess: PropTypes.bool,
  data: PropTypes.shape({}),
  lang: PropTypes.string,
}

const defaultProps = {
  fetchAutoDoseData: () => { },
  deleteAutoDose: () => { },
  deleteRow: () => { },
  isSuccess: true,
  data: {},
  lang: '',
}

class AutoDose extends React.Component {
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
    const { fetchAutoDoseData } = this.props
    fetchAutoDoseData(pageNumber.selected + 1)
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
      <Trans i18nKey="AUTO_DOSE">
                </Trans>
      </h1> */}

            <Link to="/auto-dose/new" className="pt-3 float-right mr-5">
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
                    {/* <th>ID</th> */}
                    <th>
                      <Trans i18nKey="STATUS" />
                    </th>
                    <th>
                      <Trans i18nKey="TYPE" />
                    </th>
                    <th>
                      <Trans i18nKey="NAME" />
                    </th>
                    <th>
                      <Trans i18nKey="COMPANY" />
                    </th>
                    <th>
                      <Trans i18nKey="STANDARD_PACKAGING_SIZE" />
                    </th>
                    <th>
                      <Trans i18nKey="COUNTRIES_AVAILABLE" />
                    </th>
                    <th>
                      <Trans i18nKey="PNC" />
                    </th>
                    <th>
                      <Trans i18nKey="DOSING_AMOUNT" />
                    </th>
                    <th>
                      <Trans i18nKey="IMAGE" />
                    </th>
                    <th>
                      <Trans i18nKey="PURCHASE_LINK" />
                    </th>
                    <th style={{ width: 170 }}>
                      <Trans i18nKey="ACTION" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.data.map(item => (
                    <AutoDoseRow
                      key={item.id}
                      {...item[lang]}
                      countries={item[lang] && item[lang].countries ? item[lang].countries.join(', ') : ''}
                      pnc={item[lang] && item[lang].pnc ? item[lang].pnc.join(', ') : ''}
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

AutoDose.propTypes = propTypes
AutoDose.defaultProps = defaultProps

const mapStateToProps = store => ({
  lang: store.language,
})

const mapDispatchToProps = {
  fetchAutoDoseData,
  deleteAutoDose,
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoDose)
