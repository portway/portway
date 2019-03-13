import BusinessUser from '../businesstime/user'

const usersController = function(router) {
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
