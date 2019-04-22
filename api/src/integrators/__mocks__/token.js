export default {
  generateToken: jest.fn(() => 'not-a-real-token'),
  generatePasswordResetToken: jest.fn(() => 'not-a-real-password-reset-token'),
  generateProjectToken: jest.fn(() => 'maybe-a-real-token-but-probably-not')
}
