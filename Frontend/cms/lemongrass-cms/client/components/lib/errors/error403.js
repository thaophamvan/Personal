import React from 'react'
/*eslint-disable */
const Error403 = () => (
  <div className="error__403">
    <div className="request-access">
      <div className="error__403-image" />
      <h3>
        `You don't have permission to view this page`
      </h3>
      <p>
        {`This is because it's inheriting restrictions from a parent page.
        A space admin or the person who shared this page may be able to give you access.`}
      </p>
    </div>
  </div>
)

export default Error403
