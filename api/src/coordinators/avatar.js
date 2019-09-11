import BusinessOrganization from '../businesstime/organization'
import BusinessUser from '../businesstime/user'
import { uploadAvatar, deleteContent } from '../integrators/s3'
import ono from 'ono'
import { parse } from 'url'

const updateOrganizationAvatar = async function(orgId, file) {
  if (!file) {
    throw ono({ code: 400 }, 'Could not update organization avatar, there was no file attached')
  }

  const currentOrg = await BusinessOrganization.findSanitizedById(orgId)
  if (!currentOrg) {
    throw ono({ code: 404 }, `Could not update organization avatar, organization with id {orgId} not found`)
  }
  const currentAvatar = currentOrg.avatar

  const url = await uploadAvatar({ orgId, file })
  const org = await BusinessOrganization.updateById(orgId, { avatar: url })

  if (currentAvatar) {
    //fire and move on
    deleteContent(parse(currentAvatar).path)
  }

  return org.avatar
}

const updateUserAvatar = async function(orgId, userId, file) {
  if (!file) {
    throw ono({ code: 400 }, 'Could not update user avatar, there was no file attached')
  }

  const currentUser = await BusinessUser.findSanitizedById(userId, orgId)
  if (!currentUser) {
    throw ono({ code: 404 }, `Could not update user avatar, user with id ${userId} not found`)
  }
  const currentAvatar = currentUser.avatar

  const url = await uploadAvatar({ orgId, userId, file })
  const user = await BusinessUser.updateById(userId, { avatar: url }, orgId)

  if (currentAvatar) {
    //fire and move on
    deleteContent(parse(currentAvatar).path)
  }

  return user.avatar
}

export default {
  updateOrganizationAvatar,
  updateUserAvatar
}
