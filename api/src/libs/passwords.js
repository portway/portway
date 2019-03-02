import bcrypt from 'bcrypt'

// The bcrypt salt rounds impact how expensive it is to
// hash the password. More rounds = more expensive
// The recommendation is to use as many rounds as possible
// while allowing your app to remain performant
// Details, including performance numbers on a 7th Gen Core i7 2.8ghz:
// https://auth0.com/blog/hashing-in-action-understanding-bcrypt/

const SALT_ROUNDS = 11

const generateHash = async(password) => {
  const hash = await bcrypt.hash(password, SALT_ROUNDS)
  return hash
}

const validatePassword = async(password, hashedPassword) => {
  const match = await bcrypt.compare(password, hashedPassword)
  return match
}

export default {
  generateHash,
  validatePassword
}