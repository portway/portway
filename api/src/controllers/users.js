import BusinessUser from '../businesstime/user'

const usersController = function(router) {
  //TODO we don't want to actually fetch all users, needs to be converted to a fetch by organization id
  router.get('/', getUsers)
}

const getUsers = async function(req, res) {
  try {
    const users = await BusinessUser.findAllSanitized()
    res.json(users)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch users' })
  }
}

export default usersController
