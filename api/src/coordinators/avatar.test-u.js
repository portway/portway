import BusinessOrganization from '../businesstime/organization'
import BusinessUser from '../businesstime/user'
import { uploadAvatar } from '../integrators/s3'
import avatarCoordinator from './avatar'

jest.mock('../integrators/s3')
jest.mock('../businesstime/organization')
jest.mock('../businesstime/user')

describe('avatar coordinator', () => {
  const orgId = 999

  describe('#updateOrganizationAvatar', () => {
    const file = {}
    let resolvedValue

    beforeAll(async () => {
      BusinessOrganization.updateById.mockClear()
      uploadAvatar.mockClear()
      resolvedValue = await avatarCoordinator.updateOrganizationAvatar(orgId, file)
    })

    it('should call uploadAvatar with a config object containing the passed in org id and file', () => {
      expect(uploadAvatar.mock.calls.length).toBe(1)
      expect(uploadAvatar.mock.calls[0][0]).toEqual(expect.objectContaining({ orgId, file }))
    })

    it('should call BusinessOrganization.updateById with the org Id and returned url value', () => {
      const url = uploadAvatar.mock.results[0].value
      expect(BusinessOrganization.updateById.mock.calls[0][0]).toBe(orgId)
      expect(BusinessOrganization.updateById.mock.calls[0][1]).toEqual(expect.objectContaining({ avatar: url }))
    })

    it('should resolve with avatar url', () => {
      const url = BusinessOrganization.updateById.mock.results[0].value.avatar
      expect(resolvedValue).toBe(url)
    })
  })

  describe('#updateUserAvatar', () => {
    const userId = 888
    const file = {}
    let resolvedValue

    beforeAll(async () => {
      BusinessUser.updateById.mockClear()
      uploadAvatar.mockClear()
      resolvedValue = await avatarCoordinator.updateUserAvatar(orgId, userId, file)
    })

    it('should call uploadAvatar with a config object containing the passed in org id and file', () => {
      expect(uploadAvatar.mock.calls.length).toBe(1)
      expect(uploadAvatar.mock.calls[0][0]).toEqual(expect.objectContaining({ orgId, userId, file }))
    })

    it('should call BusinessUser.updateById with the org Id and returned url value', () => {
      const url = uploadAvatar.mock.results[0].value
      expect(BusinessUser.updateById.mock.calls[0][0]).toBe(userId)
      expect(BusinessUser.updateById.mock.calls[0][1]).toEqual(expect.objectContaining({ avatar: url }))
      expect(BusinessUser.updateById.mock.calls[0][2]).toBe(orgId)
    })

    it('should resolve with avatar url', () => {
      const url = BusinessUser.updateById.mock.results[0].value.avatar
      expect(resolvedValue).toBe(url)
    })
  })
})
