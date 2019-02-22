import express from 'express'
import { renderBundles } from '../libs/express-utilities'

const router = express.Router()

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('billing', renderBundles(req, 'Billing', 'billing'))
})

export default router
