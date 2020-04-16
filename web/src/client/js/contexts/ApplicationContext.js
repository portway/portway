import React from 'react'

import { NETWORK_STATUS } from 'Shared/constants'

const ApplicationContext = React.createContext({
  networkStatus: NETWORK_STATUS.ONLINE
})

export default ApplicationContext
