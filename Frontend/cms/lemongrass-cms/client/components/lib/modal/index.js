import React from 'react'
import Modal from 'react-modal'
import { Trans } from 'react-i18next'
import PropTypes from 'prop-types'
import ButtonElec from '../button'

const propTypes = {
  name: PropTypes.string,
  isOpenModal: PropTypes.bool,
  closeModal: PropTypes.func,
  confirmation: PropTypes.func,
}

const defaultProps = {
  name: '',
  isOpenModal: false,
  closeModal: () => { },
  confirmation: () => { },
}

const ModalConfirmation = ({
  name, isOpenModal, closeModal, confirmation,
}) => {
  const msg = `Are you sure to delete item '${name}'?`
  return (
    <Modal
      isOpen={isOpenModal}
      ariaHideApp={false}
      onRequestClose={() => closeModal()}
      contentLabel="New Language"
      style={{
        overlay: {
          backgroundColor: 'rgba(82, 80, 80, 0.75)',
        },
        content: {
          top: '36%',
          left: '58%',
          right: '58%',
          bottom: '30%',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
        },
      }}
    >
      <div className="modal-header">
        <div className="mx-auto m-0">
          <h4 className="modal-title mx-auto text-center m-4">
            {msg}
          </h4>
        </div>
        <button type="button" onClick={() => closeModal()} className="close ml-0" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div className="modal-footer text-center">
        <ButtonElec className="btn-save w-50 m-2" type="submit" onClick={() => confirmation()}>OK</ButtonElec>
        <ButtonElec className="mr-3 btn-light w-50 m-2" type="button" onClick={() => closeModal()}>
          <Trans i18nKey="CANCEL" />
        </ButtonElec>
      </div>
    </Modal>
  )
}

ModalConfirmation.propTypes = propTypes
ModalConfirmation.defaultProps = defaultProps

export default ModalConfirmation
