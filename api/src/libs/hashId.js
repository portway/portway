import { HASH_ID_SALT } from '../constants/s3'
import Hashids from 'hashids'
const hashids = new Hashids(HASH_ID_SALT, 8)

export const getHashIdFromOrgId = function(orgId) {
  return hashids.encode(orgId)
}

export const getOrgIdFromHashId = function(hashId) {
  return hashids.decode(hashId)
}