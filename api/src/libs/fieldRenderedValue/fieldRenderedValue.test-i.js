import { getRenderedValueByType } from './'
import { FIELD_TYPES } from '../../constants/fieldTypes'


describe('fieldRenderedValue', () => {
  describe('#getRenderedValueByType', () => {
    const baseField = { id: 111000111, name: 'not-a-real-name' }

    describe('when type is STRING', () => {
      let result
      const field = { ...baseField, type: FIELD_TYPES.STRING }
      const value = 'I am a test string'

      beforeAll(async () => {
        result = await getRenderedValueByType(field, value)
      })

      it('should return a rendered string containing the name and value', () => {
        expect(result).toContain(baseField.name)
        expect(result).toContain(value)
      })
    })

    describe('when type is TEXT', () => {
      let result
      const field = { ...baseField, type: FIELD_TYPES.TEXT }
      const value = 'I am test text'

      beforeAll(async () => {
        result = await getRenderedValueByType(field, value)
      })

      it('should return a rendered string containing the name and value', () => {
        expect(result).toContain(baseField.name)
        expect(result).toContain(value)
      })
    })

    describe('when type is IMAGE', () => {
      let result
      const field = {
        ...baseField,
        type: FIELD_TYPES.IMAGE,
        meta: { width: 20, height: 30 },
        alignment: 'left'
      }
      const value = 'testimagesource'

      beforeAll(async () => {
        result = await getRenderedValueByType(field, value)
      })

      describe('when there is not a webp value', () => {
        beforeAll(async () => {
          result = await getRenderedValueByType(field, value)
        })

        it('should return a rendered string containing the name and value', () => {
          expect(result).toContain(baseField.name)
          expect(result).toContain(value)
          expect(result).toContain(field.meta.width)
          expect(result).toContain(field.meta.height)
          expect(result).toContain(field.alignment)
        })
      })

      describe('when there is a webp value', () => {
        const webPhalf = 'webphalfsource'
        const webPfull = 'webpfullsource'
        const originalHalf = 'originalHalf'
        const originalFull = 'originalFull'

        beforeAll(async () => {
          result = await getRenderedValueByType({
            ...field,
            formats: {
              webp: { webPhalf, webPfull },
              original: { half: originalHalf, full: originalFull }
            }
          }, value)
        })

        it('should return a rendered string containing the name and value', () => {
          expect(result).toContain(baseField.name)
          expect(result).toContain(field.meta.width)
          expect(result).toContain(field.meta.height)
          expect(result).toContain(field.alignment)
          expect(result).toContain(webPhalf)
          expect(result).toContain(webPfull)
        })
      })
    })

    describe('when type is NUMBER', () => {
      let result
      const field = { ...baseField, type: FIELD_TYPES.NUMBER }
      const value = 99

      beforeAll(async () => {
        result = await getRenderedValueByType(field, value)
      })

      it('should return a rendered string containing the name and value', () => {
        expect(result).toContain(baseField.name)
        expect(result).toContain(value)
      })
    })

    describe('when type is DATE', () => {
      let result
      const field = { ...baseField, type: FIELD_TYPES.DATE }
      const value = (new Date()).toISOString()

      beforeAll(async () => {
        result = await getRenderedValueByType(field, value)
      })

      it('should return a rendered string containing the name and value', () => {
        expect(result).toContain(baseField.name)
        expect(result).toContain(value)
      })
    })

    describe('when type is FILE', () => {
      let result
      const field = { ...baseField, type: FIELD_TYPES.FILE }
      const value = 'I am test number'

      beforeAll(async () => {
        result = await getRenderedValueByType(field, value)
      })

      it('should return a rendered string containing the name and value', () => {
        expect(result).toContain(baseField.name)
        expect(result).toContain(value)
      })
    })

    describe('when type is not found', () => {
      const fieldType = 999000
      const field = { ...baseField, type: 999000 }
      const value = 'I am test number'

      it('should resolve with an error', async () => {
        expect(getRenderedValueByType(field, value)).rejects.toEqual({
          error: `No renderer found for field type: ${fieldType}`
        })
      })
    })
  })
})
