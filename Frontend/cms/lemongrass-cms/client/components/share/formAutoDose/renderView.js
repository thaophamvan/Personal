import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  model: PropTypes.arrayOf(PropTypes.shape({})),
  data: PropTypes.shape({}),
}

const defaultProps = {
  model: [],
  data: {},
}

const RenderView = ({ model, data }) => (
  <div className="d-flex flex-wrap">
    {
      [...model].map((m, i) => (
        <div className="form-group row col-6" key={i.toString()}>
          <label
            className="form-label col-12"
            key={`l${m.key}`}
          >
            {m.label}
          </label>
          <label
            name={m.key}
            className="col-12"
          >
            {data[m.key]}
          </label>
        </div>
      ))
    }
  </div>
)

RenderView.propTypes = propTypes
RenderView.defaultProps = defaultProps

export default RenderView
