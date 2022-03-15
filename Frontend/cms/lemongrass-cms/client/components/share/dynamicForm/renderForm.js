import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  model: PropTypes.arrayOf(PropTypes.shape({})),
  data: PropTypes.shape({}),
  onChange: PropTypes.func,
}

const defaultProps = {
  model: [],
  data: {},
  onChange: () => { },
}

const RenderForm = ({ model, data, onChange }) => (
  <div className="d-flex flex-wrap">
    {
      [...model].map((m, i) => (
        <div className="form-group row col-6" key={i.toString()}>
          <label
            className="form-label m-2"
            key={`l${m.key}`}
            htmlFor={`i${m.key}`}
          >
            {m.label}
          </label>
          <input
            {...m.props}
            name={m.key}
            className="form-control m-2"
            type={m.type}
            key={`i${m.key}`}
            value={data[m.key]}
            /* ref={(key) => { this[m.key] = m.key }} */
            onChange={(e) => { onChange(e, m.key) }}
          />
        </div>
      ))
    }
  </div>
)

RenderForm.propTypes = propTypes
RenderForm.defaultProps = defaultProps

export default RenderForm
