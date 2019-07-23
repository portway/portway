import React from 'react'

import './_AdminSeatsStyles.scss'

const AdminSeatsComponent = () => {
  return (
    <div className="admin-seats">
      <div className="admin-seats__status">
        <span className="admin-seats__status__label"><b>3</b> out of <b>10</b> Seats</span>
        <meter className="admin-seats__status__meter" value="3" min="1" max="10" low="3" high="9" optimum="7">3/10</meter>
        <button className="btn btn--small">Add seats</button>
      </div>
    </div>
  )
}

AdminSeatsComponent.propTypes = {
}

export default AdminSeatsComponent
