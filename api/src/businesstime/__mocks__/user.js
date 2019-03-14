export default {
  findByEmail: jest.fn(() => ({
    email: 'not-a-real-email@email.com',
    password: 'not-a-real-hashed-password'
  })),
  updateByEmail: jest.fn(() => ({
    email: 'not-a-real-email@email.com',
    password: 'not-a-real-hashed-password'
  }))
}
