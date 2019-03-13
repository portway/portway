export default {
  generateHash: jest.fn(() => 'not-a-real-hash'),
  validatePassword: jest.fn(() => true)
}