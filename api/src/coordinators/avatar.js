import BusinessOrganization from '../businesstime/organization'
import BusinessUser from '../businesstime/user'
import { uploadAvatar } from '../integrators/s3'
import ono from 'ono'

const updateOrganizationAvatar = async function(orgId, file) {
  if (!file) {
    throw ono({ code: 400 }, 'Could not update organization avatar, there was no file attached')
  }
  const url = await uploadAvatar({ orgId, file })
  const org = await BusinessOrganization.updateById(orgId, { avatar: url })
  return org.avatar
}

const updateUserAvatar = async function(orgId, userId, file) {
  if (!file) {
    throw ono({ code: 400 }, 'Could not update user avatar, there was no file attached')
  }
  const url = await uploadAvatar({ orgId, userId, file })
  const user = await BusinessUser.updateById(userId, { avatar: url }, orgId)
  return user.avatar
}

export default {
  updateOrganizationAvatar,
  updateUserAvatar
}
