import React from 'react'
import PropTypes from 'prop-types'
import { Trans } from 'react-i18next'
import { Link } from 'react-router-dom'
import ButtonElec from '../../lib/button'
import RenderForm from './renderForm'
import RenderView from './renderView'
import { history } from '../../../utilities/history'

const propTypes = {
  props: PropTypes.shape({}),
  model: PropTypes.arrayOf(PropTypes.shape({})),
  title: PropTypes.string,
  className: PropTypes.string,
  currentData: PropTypes.shape({}),
  updateData: PropTypes.func,
  submitData: PropTypes.func,
  lang: PropTypes.string,
  edit: PropTypes.bool,
}

const defaultProps = {
  props: {},
  model: [],
  title: '',
  className: '',
  currentData: {},
  updateData: () => { },
  submitData: () => { },
  lang: '',
  edit: false,
}
/*eslint-disable */
const DynamicForm = (props) => {
  const inputFormatDecima = ['height', 'diameter', 'volume']
  const changeFieldValue = (e, key) => {
    if (inputFormatDecima.includes(e.target.name)) {
      const regexDecima = /^\d+(\.\d{1,9})?$/g
      const regexBefore = /^\d+(\d{1,9}\.)?$/g
      if (regexDecima.test(e.target.value) || regexBefore.test(e.target.value)) {
        props.currentData[props.lang] = props.currentData[props.lang] ? props.currentData[props.lang] : {}
        props.currentData[props.lang][key] = e.target.value
        const currentData = props.currentData
        props.updateData({
          currentData,
        })
      }
    } else {
      props.currentData[props.lang] = props.currentData[props.lang] ? props.currentData[props.lang] : {}
      props.currentData[props.lang][key] = e.target.value
      const currentData = props.currentData
      props.updateData({
        currentData,
      })
    }
  }

  const submitForm = (e) => {
    e.preventDefault()

    if (props.edit) {
      props.submitData()
      return
    }

    props.updateData({
      edit: true,
    })
  }

  return (
    <form onSubmit={submitForm} className="p-3 m-3 bg-light rounded form-edit">
      <p className="h3 mb-3">{props.title}</p>
      {props.edit
        ? (
          <div className={props.className}>
            <RenderForm model={props.model} data={props} onChange={changeFieldValue.bind(this)} />
            <ButtonElec className="mr-3 btn-save mt-3" type="submit">
              <Trans i18nKey="SAVE" />
            </ButtonElec>
            <CancelButton />
          </div>
        )
        : (
          <div className={props.className}>
            <RenderView model={props.model} data={props} />
            <ButtonElec icon="fa fa-pencil btn-edit__icon" className="mr-3 btn-edit mt-3" type="submit">
              <Trans i18nKey="EDIT" />
            </ButtonElec>
          </div>
        )}
    </form>
  )
}

const CancelButton = () => {
  switch (history.location.pathname.split('/')[1]) {
    case 'drink-type':
      return (
        <Link to="/drink-type">
          <ButtonElec className="mr-3 btn-light mt-3" type="button">
            <Trans i18nKey="CANCEL" />
          </ButtonElec>
        </Link>
      )
    case 'drink-temperature':
      return (
        <Link to="/drink-temperature">
          <ButtonElec className="mr-3 btn-light mt-3" type="button">
            <Trans i18nKey="CANCEL" />
          </ButtonElec>
        </Link>
      )
    case 'auto-dose':
      return (
        <Link to="/auto-dose">
          <ButtonElec className="mr-3 btn-light mt-3" type="button">
            <Trans i18nKey="CANCEL" />
          </ButtonElec>
        </Link>
      )
    default:
      return null
  }
}

DynamicForm.propTypes = propTypes
DynamicForm.defaultProps = defaultProps

export default DynamicForm
