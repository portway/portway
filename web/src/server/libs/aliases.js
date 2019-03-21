const ALIASES = {
  // Removed these aliases because it's easier to have two separate controllers
  // '/sign-in': '/users/sign-in',
  // '/sign-up': '/users/sign-up'
}

const ALIAS_KEYS = Object.keys(ALIASES)

export default (req, res, next) => {
  const aliasedRoute = ALIAS_KEYS.find((key) => {
    const regex = RegExp(`^${key}$`)
    return regex.test(req.path)
  })

  if (aliasedRoute) {
    console.info(`matched alias ${aliasedRoute} to ${ALIASES[aliasedRoute]}`)
    req.url = ALIASES[aliasedRoute]
    req.app.handle(req, res)
  } else {
    next()
  }
}
