import { Users } from '../../actions'
import Store from '../../reducers'

const LogoutComponent = () => {
  Store.dispatch(Users.logout())
  return null
}

export default LogoutComponent
