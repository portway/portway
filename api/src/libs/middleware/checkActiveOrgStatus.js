import BusinessOrganization from '../../businesstime/organization'
import { STRIPE_STATUS } from '../../constants/plans'
import ono from 'ono'

export default async function checkActiveOrgStatus(req, res, next) {
  const { orgId } = req.requestorInfo
  const org = await BusinessOrganization.findById(orgId)
  if (org.subscriptionStatus === STRIPE_STATUS.ACTIVE || org.subscriptionStatus === STRIPE_STATUS.TRIALING) {
    return next()
  }
  next(ono({ code: 401 }, 'Organization is not active'))
}