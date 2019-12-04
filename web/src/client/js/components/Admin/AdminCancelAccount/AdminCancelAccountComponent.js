import React from 'react'
import PropTypes from 'prop-types'

const AdminCancelAccountComponent = ({ deleteAccountHandler }) => {
  return (
    <>
      <h2 className="danger">Cancel account?</h2>
      <p>Cancel your Portway account, and remove all data.</p>
      <button className="btn btn--white btn--danger" onClick={deleteAccountHandler}>Cancel my account</button>
    </>
  )
}

AdminCancelAccountComponent.propTypes = {
  deleteAccountHandler: PropTypes.func.isRequired,
}

export default AdminCancelAccountComponent
