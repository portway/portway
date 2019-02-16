import React from 'react'
import { connect } from 'react-redux'

class ProjectContainer extends React.Component {
  render() {
    return (
      <div>
        <h1>Project</h1>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    projects: state.projects
  }
}

// const mapDispatchToProps = (dispatch) => {
//   return {
//     onSomeFunction: (id) => {
//       dispatch(someAction(id))
//     }
//   }
// }

export default connect(mapStateToProps)(ProjectContainer)
