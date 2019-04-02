import BusinessFieldValue from './fieldValue'
import initializeTestDb from '../db/__testSetup__/initializeTestDb'

describe('BusinessFieldValue', () => {
  beforeAll(async () => {
    await initializeTestDb()
  })

  describe('#create', () => {
    describe('type: 1 - STRING', () => {
      const value = 'test-string'
      let fieldValue

      beforeAll(async () => {
        fieldValue = await BusinessFieldValue.create(1, value, 1)
      })

      it('should return the saved fieldValue as a POJO', () => {
        expect(fieldValue).toEqual(
          expect.objectContaining({ value, orgId: 1 })
        )
        expect(fieldValue.constructor).toBe(Object)
      })
    })

    describe('type: 2 - TEXT', () => {
      const value =
        'test text test text test text test text test text test text test text test text' +
        'text test text test text test text test text test text test text test text test' +
        'test text test text test text test text test text test text test text test text' +
        'text test text test text test text text test text test text test text text test'

      let fieldValue

      beforeAll(async () => {
        fieldValue = await BusinessFieldValue.create(2, value, 1)
      })

      it('should return the saved fieldValue as a POJO', () => {
        expect(fieldValue).toEqual(
          expect.objectContaining({ value, orgId: 1 })
        )
        expect(fieldValue.constructor).toBe(Object)
      })
    })

    describe('type: 3 - NUMBER', () => {
      const value = 42
      let fieldValue

      beforeAll(async () => {
        fieldValue = await BusinessFieldValue.create(3, value, 1)
      })

      it('should return the saved fieldValue as a POJO', () => {
        expect(fieldValue).toEqual(
          expect.objectContaining({ value, orgId: 1 })
        )
        expect(fieldValue.constructor).toBe(Object)
      })
    })
  })
})
