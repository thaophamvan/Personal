import React from 'react'
import PropTypes from 'prop-types'

const propTypes = {
  model: PropTypes.shape({}),
  data: PropTypes.shape({}),
  onChange: PropTypes.func,
}

const defaultProps = {
  model: {},
  data: {},
  onChange: () => { },
}

const RenderForm = ({ model, data, onChange }) => (
  <div>
    {
      [...model].map((m, i) => (
        <div className="form-group row" key={i.toString()}>
          <label
            className="col-sm-2 form-label"
            key={`l${m.key}`}
            htmlFor={`i${m.key}`}
          >
            {m.label}
          </label>
          <div className="col-sm-10">
            <input
              {...m.props}
              name={m.key}
              className="form-control mb-10"
              type={m.type}
              key={`i${m.key}`}
              value={data[m.key]}
              /* ref={(key) => { this[m.key] = m.key }} */
              onChange={(e) => { onChange(e, m.key) }}
            />
          </div>
        </div>
      ))
    }
  </div>
)

RenderForm.propTypes = propTypes
RenderForm.defaultProps = defaultProps

export default RenderForm
