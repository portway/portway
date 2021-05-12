import BusinessOrganization from '../businesstime/organization'
import billingCoordinator from '../coordinators/billing'
import BusinessResourceUsage from '../businesstime/resourceusage'

const getOrgWithDetails = async function(orgId) {
  const org = await BusinessOrganization.findById(orgId)
  const orgBilling = await billingCoordinator.getOrgBilling(orgId)
  const assetUsageValue = await BusinessResourceUsage.findOrgAssetUsageValue(orgId)

  return {
    org,
    orgBilling,
    assetUsage: assetUsageValue
  }
}

const adminCoordinator = {
  getOrgWithDetails
}

export default adminCoordinator