import React from 'react'
import PropTypes from 'prop-types'

const AdminUserViewComponent = ({ user }) => {
  return (
    <div>{user.name}</div>
  )
}

AdminUserViewComponent.propTypes = {
  user: PropTypes.object.isRequired
}

export default AdminUserViewComponent
