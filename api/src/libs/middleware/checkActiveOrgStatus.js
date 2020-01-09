import BusinessOrganization from '../../businesstime/organization'
import { ORG_SUBSCRIPTION_STATUS } from '../../constants/plans'
import ono from 'ono'

export default async function checkActiveOrgStatus(req, res, next) {
  const { orgId } = req.requestorInfo
  const org = await BusinessOrganization.findById(orgId)
  if (org.subscriptionStatus === ORG_SUBSCRIPTION_STATUS.ACTIVE
    || org.subscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIALING
    || org.subscriptionStatus === ORG_SUBSCRIPTION_STATUS.TRIALING_PENDING_ACTIVE
    || org.subscriptionStatus === ORG_SUBSCRIPTION_STATUS.PENDING_CANCEL) {
    return next()
  }
  next(ono({ code: 403 }, 'Organization is not active'))
}
