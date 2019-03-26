import BusinessUser from '../businesstime/user'
import ono from 'ono'
import crudPerms from '../libs/middleware/reqCrudPerms'
import RESOURCE_TYPES from '../constants/resourceTypes'

const { readPerm, listPerm } = crudPerms(RESOURCE_TYPES.USER, (req) => {
  req.params.id
})

const usersController = function(router) {
  router.get('/', listPerm, getUsers)
  router.get('/:id', readPerm, getUser)
}

const getUsers = async function(req, res) {
  try {
    const users = await BusinessUser.findAllSanitized(req.requestorInfo.orgId)
    res.json(users)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: 'Cannot fetch users' })
  }
}

const getUser = async function(req, res) {
  const id = req.params.id

  try {
    const user = await BusinessUser.findSanitizedById(id, req.requestorInfo.orgId)
    if (!user) throw ono({ code: 404 }, `No user with id ${id}`)
    res.json(user)
  } catch (e) {
    console.error(e.stack)
    res.status(e.code || 500).json({ error: `error fetching user with id ${id}` })
  }
}

export default usersController
