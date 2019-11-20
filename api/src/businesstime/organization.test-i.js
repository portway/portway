import OrganizationBusiness from './organization'
import OrganizationFactory from '../db/__testSetup__/factories/organization.js'
import initializeTestDb, { clearDb } from '../db/__testSetup__/initializeTestDb'

describe('OrganizationBusiness', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#create', () => {
    const organizationBody = { name: 'test-org' }
    let organization

    beforeAll(async () => {
      organization = await OrganizationBusiness.create(organizationBody)
    })

    it('should return the saved organization as a POJO', () => {
      expect(organization).toEqual(expect.objectContaining(organizationBody))
      expect(organization.constructor).toBe(Object)
    })
  })

  describe('#updateById', () => {
    describe('when the target organization is found', () => {
      let organization
      const updateBody = { name: 'an-updated-name' }

      beforeAll(async () => {
        const factoryOrganizations = await OrganizationFactory.createMany(1)
        organization = await OrganizationBusiness.updateById(factoryOrganizations[0].id, updateBody)
      })

      it('should return a POJO with updated body fields', () => {
        expect(organization).toEqual(expect.objectContaining(updateBody))
        expect(organization.constructor).toBe(Object)
      })
    })

    describe('when the target organization is not found', () => {
      it('should throw an error', async () => {
        await expect(OrganizationBusiness.updateById(0)).rejects.toThrow()
      })
    })
  })

  describe('organization fetching', () => {
    let factoryOrganizations

    beforeAll(async () => {
      await clearDb()
      factoryOrganizations = await OrganizationFactory.createMany(1)
    })

    describe('#findSanitizedById', () => {
      let targetOrganizationId
      let organization

      beforeAll(async () => {
        targetOrganizationId = factoryOrganizations[0].get('id')
        organization = await OrganizationBusiness.findSanitizedById(targetOrganizationId)
      })

      it('should return organization as POJO', () => {
        expect(organization.id).toBe(targetOrganizationId)
        expect(organization.constructor).toBe(Object)
      })
    })

    describe('#findById', () => {
      describe('with a valid id', () => {
        let targetOrganizationId
        let organization

        beforeAll(async () => {
          targetOrganizationId = factoryOrganizations[0].get('id')
          organization = await OrganizationBusiness.findById(targetOrganizationId)
        })

        it('should return organization as POJO', () => {
          expect(organization.id).toBe(targetOrganizationId)
          expect(organization.constructor).toBe(Object)
        })
      })

      it('with an invalid id should throw an error', async () => {
        const targetOrgId = 'this aint no id'

        await expect(OrganizationBusiness.findById(targetOrgId)).rejects
          .toThrow(/Cannot find organization with id/)
      })
    })
  })
})