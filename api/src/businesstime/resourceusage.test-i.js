import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'
import BusinessResourceUsage, { RESOURCE_TYPES } from './resourceusage'
import constants from '../db/__testSetup__/constants'

describe('resourceUsage', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('addUsageByType', () => {
    describe('with allowable space', () => {
      it('should add usage', async () => {
        await expect(BusinessResourceUsage.addUsageByType(constants.ORG_ID, RESOURCE_TYPES.ASSET, 12, 124)).resolves
      })
      it('should add more usage', async () => {
        await expect(
          BusinessResourceUsage.addUsageByType(
            constants.ORG_ID,
            RESOURCE_TYPES.ASSET,
            89,
            124
          )
        ).resolves
      })
    })
  })

  describe('findOrCreateUsageByType', () => {

  })
})