import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'

import { currentUserId } from 'Libs/currentIds'
import { fetchUsersWithIds } from 'Actions/user'
import useDocumentSocket from 'Hooks/useDocumentSocket'
import useSyncDocumentRoom from 'Hooks/useSyncDocumentRoom'
import { updateDocumentRoomUsers } from '../../sockets/SocketProvider'

import DocumentUsersComponent from './DocumentUsersComponent'

const DocumentUsersContainer = ({ fetchUsersWithIds, usersById, usersLoadedById }) => {
  const fullActiveUsers = useRef()
  const { documentId } = useParams()
  const { state: socketState } = useDocumentSocket()

  const activeUsers = socketState.activeDocumentUsers[documentId]
  const unloadedIds = activeUsers && activeUsers.filter((userId) => {
    return usersLoadedById[userId] === undefined
  })

  useEffect(() => {
    fullActiveUsers.current = []
    if (activeUsers && activeUsers.length) {
      activeUsers.forEach((userId) => {
        if (Number(userId) !== currentUserId) {
          fullActiveUsers.current.push(usersById[userId])
        }
      })
    }
  }, [activeUsers, usersById])

  useEffect(() => {
    if (unloadedIds && unloadedIds.length > 0) {
      fetchUsersWithIds(unloadedIds)
    }
  }, [fetchUsersWithIds, unloadedIds])

  useSyncDocumentRoom(documentId)

  return <DocumentUsersComponent activeUsers={fullActiveUsers.current} />
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
