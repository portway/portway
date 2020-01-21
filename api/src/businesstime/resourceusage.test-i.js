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

    describe('without allowable space', () => {
      it('should throw an error', async () => {
        await expect(BusinessResourceUsage.addUsageByType(
          constants.ORG_ID,
          RESOURCE_TYPES.ASSET,
          2000,
          1873
        )).rejects.toThrow(/Asset storage has exceeded maximum allowed/)
      })
    })

    describe('with invalid parameters', () => {
      it('should throw an error with string value', async () => {
        await expect(
          BusinessResourceUsage.addUsageByType(
            constants.ORG_ID,
            RESOURCE_TYPES.ASSET,
            'string',
            1873
          )
        ).rejects.toThrow(/value must be an integer/)
      })
      it('should throw an error with string maxValue', async () => {
        await expect(
          BusinessResourceUsage.addUsageByType(
            constants.ORG_ID,
            RESOURCE_TYPES.ASSET,
            123,
            'string'
          )
        ).rejects.toThrow(/maxValue must be an integer/)
      })
    })
  })

  describe('findOrCreateUsageByType', () => {
    describe('for an org with no usage', () => {
      let usage
      beforeAll(async () => {
        usage = await BusinessResourceUsage.findOrCreateUsageByType(
          constants.ORG_2_ID,
          RESOURCE_TYPES.ASSET
        )
      })
      it('should return usage with zero value', () => {
        expect(usage.value).toBe(0)
      })

      it('should return asset type usage', () => {
        expect(usage.resourceType).toEqual(RESOURCE_TYPES.ASSET)
      })
    })

    describe('for an org with usage', () => {
      const usageValue = 12
      let usage
      beforeAll(async () => {
        await BusinessResourceUsage.addUsageByType(
          constants.ORG_ID,
          RESOURCE_TYPES.ASSET,
          usageValue,
          300
        )
        usage = await BusinessResourceUsage.findOrCreateUsageByType(constants.ORG_ID, RESOURCE_TYPES.ASSET)
      })

      it('should return usage value', () => {
        expect(usage.value).toEqual(usageValue)
      })

      it('should return asset type usage', () => {
        expect(usage.resourceType).toEqual(RESOURCE_TYPES.ASSET)
      })
    })
  })
})