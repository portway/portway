import { connect, getDb } from './db-connector'
import Sequelize from 'sequelize'

describe('DBConnector', () => {
  describe('connect', () => {
    it('should throw an error if trying to use db before calling connect()', () => {
      expect(() => {
        getDb()
      }).toThrow()
    })

    it('should connect to the db instance', () => {
      connect({ host: 'localhost', port: 5432, user: 'bonkey', password: 'bong', db: 'test' })
    })
  })
  
  describe('getDb', () => {
    it('should return the db instance if already connected', () => {
      const db = getDb()
      expect(db).toBeInstanceOf(Sequelize)
    })

    it('should return the same db instance every time', () => {
      const db = getDb()
      const db2 = getDb()
      expect(db).toEqual(db2)
    })
  })
})
