import express from 'express'
import { renderBundles } from '../libs/express-utilities'

const router = express.Router()

/* GET home page. */
// Sending all requests /dashboard/* to dashboard view, for Redux Router
router.get('/*', (req, res, next) => {
  res.render('app/index', renderBundles(req, 'Welcome', 'app'))
})

export default router
