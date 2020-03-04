import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import { fetchUsersWithIds } from 'Actions/user'
import useDocumentSocket from 'Hooks/useDocumentSocket'
import { updateDocumentRoomUsers, emitJoinDocumentRoom, emitLeaveDocumentRoom } from '../../sockets/SocketProvider'

import DocumentUsersComponent from './DocumentUsersComponent'

const DocumentUsersContainer = ({ fetchUsersWithIds, usersById, usersLoadedById }) => {
  const { documentId } = useParams()
  const { state: socketState, dispatch: socketDispatch, documentSocket } = useDocumentSocket()

  const activeUsers = socketState.activeDocumentUsers[documentId]
  const currentDocumentRoom = socketState.currentDocumentRoom
  const unloadedIds = activeUsers && activeUsers.filter((userId) => {
    return usersLoadedById[userId] === undefined
  })

  useEffect(() => {
    if (unloadedIds && unloadedIds.length > 0) {
      fetchUsersWithIds(unloadedIds)
    }
  }, [fetchUsersWithIds, unloadedIds])

  useEffect(() => {
    socketDispatch(emitJoinDocumentRoom(socketDispatch, documentId))
    documentSocket.on('userChange', (userIds) => {
      socketDispatch(updateDocumentRoomUsers(documentId, userIds))
    })
    return () => {
      if (currentDocumentRoom) {
        socketDispatch(emitLeaveDocumentRoom(socketDispatch, currentDocumentRoom))
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [documentId])

  return <DocumentUsersComponent activeUsers={activeUsers} />
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
