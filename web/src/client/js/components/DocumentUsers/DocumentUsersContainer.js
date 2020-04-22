import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import { currentUserId } from 'Libs/currentIds'
import { fetchUsersWithIds } from 'Actions/user'
import { emitJoinDocumentRoom, emitLeaveDocumentRoom } from 'Actions/userSync'

import DocumentUsersComponent from './DocumentUsersComponent'

const DocumentUsersContainer = ({ fetchUsersWithIds, usersById, usersLoadedById, activeDocumentUsers, emitJoinDocumentRoom, emitLeaveDocumentRoom }) => {
  const { documentId } = useParams()

  // User Sync for document room join/leave
  useEffect(() => {
    if (document) {
      emitJoinDocumentRoom(documentId)
    }
    return () => {
      emitLeaveDocumentRoom()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId])

  const activeUsers = activeDocumentUsers[documentId] || []

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
  activeDocumentUsers: PropTypes.object,
  emitJoinDocumentRoom: PropTypes.func.isRequired,
  emitLeaveDocumentRoom: PropTypes.func.isRequired
}

const mapStateToProps = (state) => {
  return {
    usersById: state.users.usersById,
    usersLoadedById: state.users.loading.byId,
    activeDocumentUsers: state.userSync.activeDocumentUsers
  }
}

const mapDispatchToProps = { fetchUsersWithIds, emitJoinDocumentRoom, emitLeaveDocumentRoom }

export default connect(mapStateToProps, mapDispatchToProps)(DocumentUsersContainer)
