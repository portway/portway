/**
 * Creates action creators dynamically so we can have a cleaner file here
 * @param {Constant} type constant from ActionTypes
 * @param {String} argNames arguments to include in the action
 */
export const makeActionCreator = (type, ...argNames) => {
  return (...args) => {
    const action = { type }
    argNames.forEach((arg, index) => {
      action[argNames[index]] = args[index]
    })
    return action
  }
}
