/**
 * Uses node.js debug module to expose namespaced loggers
 */
import debug from 'debug'

const ROOT_NAMESPACE = 'portway'

export const permissions = debug(`${ROOT_NAMESPACE}:permissions`)
