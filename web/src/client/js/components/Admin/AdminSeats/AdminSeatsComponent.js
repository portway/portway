import React from 'react'

import './_AdminSeatsStyles.scss'

const AdminSeatsComponent = () => {
  return (
    <div className="admin-seats">
      <div className="admin-seats__status">
        <span className="admin-seats__status__label"><b>1</b> out of <b>5</b> Seats</span>
        <meter className="admin-seats__status__meter" value="2" low="1" high="4" optimum="3" min="1" max="5">
          1/5
        </meter>
        <button className="btn btn--small">Add seats</button>
      </div>
    </div>
  )
}

AdminSeatsComponent.propTypes = {
}

export default AdminSeatsComponent
