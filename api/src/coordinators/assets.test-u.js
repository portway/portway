import assetCoordinator from './assets'
import { uploadContent } from '../integrators/s3'
import BusinessResourceUsage from '../businesstime/resourceusage'
import BusinessOrganization from '../businesstime/organization'

jest.mock('../integrators/s3')
jest.mock('../businesstime/resourceusage')
jest.mock('../businesstime/organization')

describe('assetCoordinator', () => {
  describe('#addAssetForDocument', () => {
    const orgId = 1
    const documentId = 0
    const file = { size: 723 }

    beforeAll(async () => {
      jest.spyOn(assetCoordinator, 'recordOrgAsset')
      await assetCoordinator.addAssetForDocument(
        documentId, orgId, file
      )
    })

    it('should call assetCoordinator.recordOrgAsset', () => {
      expect(assetCoordinator.recordOrgAsset.mock.calls.length).toBe(1)
      expect(assetCoordinator.recordOrgAsset.mock.calls[0][0]).toEqual(orgId)
    })

    it('should call uploadContent', () => {
      expect(uploadContent.mock.calls.length).toBe(1)
      expect(uploadContent.mock.calls[0][0]).toEqual(documentId)
      expect(uploadContent.mock.calls[0][1]).toEqual(orgId)
    })

    afterAll(() => {
      assetCoordinator.recordOrgAsset.mockRestore()
    })
  })

  describe('#recordOrgAsset', () => {
    const orgId = 12
    const file = {
      size: 1234
    }

    beforeAll(async () => {
      BusinessOrganization.findSanitizedById.mockClear()
      BusinessResourceUsage.updateUsageByType.mockClear()
      await assetCoordinator.recordOrgAsset(orgId, file.size)
    })

    it('should call BusinessOrganization.findSanitizedById', () => {
      expect(BusinessOrganization.findSanitizedById.mock.calls.length).toBe(1)
      expect(BusinessOrganization.findSanitizedById.mock.calls[0][0]).toEqual(orgId)
    })

    it('should call BusinessResourceUsage.updateUsageByType', () => {
      expect(BusinessResourceUsage.updateUsageByType.mock.calls.length).toBe(1)
      expect(BusinessResourceUsage.updateUsageByType.mock.calls[0][0]).toEqual(orgId)
      expect(BusinessResourceUsage.updateUsageByType.mock.calls[0][2]).toEqual(file.size)
    })
  })
})

