import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import { currentUserId } from 'Libs/currentIds'
import { fetchUsersWithIds } from 'Actions/user'
import useDocumentSocket from 'Hooks/useDocumentSocket'
import useSyncDocumentRoom from 'Hooks/useSyncDocumentRoom'

import DocumentUsersComponent from './DocumentUsersComponent'

const DocumentUsersContainer = ({ fetchUsersWithIds, usersById, usersLoadedById }) => {
  const { documentId } = useParams()

  useSyncDocumentRoom(documentId)

  const { state: socketState } = useDocumentSocket()

  const activeUsers = socketState.activeDocumentUsers[documentId] || []

  const unloadedIds = activeUsers && activeUsers.filter((userId) => {
    return usersLoadedById[userId] === undefined
  })

  const fullActiveUsers = activeUsers.reduce((cur, userId) => {
    if (Number(userId) !== currentUserId && usersById[userId]) {
      cur = [...cur, usersById[userId]]
    }
    return cur
  }, [])

  useEffect(() => {
    if (unloadedIds && unloadedIds.length > 0) {
      fetchUsersWithIds(unloadedIds)
    }
  }, [fetchUsersWithIds, unloadedIds])

  return <DocumentUsersComponent activeUsers={fullActiveUsers} />
}

DocumentUsersContainer.propTypes = {
  fetchUsersWithIds: PropTypes.func.isRequired,
  usersById: PropTypes.object,
  usersLoadedById: PropTypes.object,
}

const mapStateToProps = (state) => {
  return {
    usersById: state.users.usersById,
    usersLoadedById: state.users.loading.byId,
  }
}

const mapDispatchToProps = { fetchUsersWithIds }

export default connect(mapStateToProps, mapDispatchToProps)(DocumentUsersContainer)
