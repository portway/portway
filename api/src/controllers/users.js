import BusinessUser from '../businesstime/user'
import ono from 'ono'

const usersController = function(router) {
  //TODO we don't want to actually fetch all users,
  // needs to be converted to a fetch by organization id
  router.get('/', getUsers)
  router.get('/:id', getUser)
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

const getUser = async function(req, res) {
  const id = req.params.id

  try {
    const user = await BusinessUser.findSanitizedById(id)
    if (!user) throw ono({ code: 404 }, `No user with id ${id}`)
    res.json(user)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching user with id ${id}` })
  }
}

export default usersController
