import React from 'react'
import { Link } from 'react-router-dom'

import Constants from 'Shared/constants'
import ToolbarComponent from 'Components/Toolbar/ToolbarComponent'
import DropdownComponent from 'Components/Dropdown/DropdownComponent'
import ProjectsListContainer from 'Components/ProjectsList/ProjectsListContainer'

class ProjectsContainer extends React.PureComponent {
  renderStart() {
    return (
      <Link
        to={Constants.PATH_PROJECT_CREATE}
        className="btn btn--blank btn--with-circular-icon">
        <span className="icon icon-add" /> New
      </Link>
    )
  }

  renderEnd() {
    const filterButton = {
      className: 'btn--blank',
      icon: 'icon-filter',
      label: 'Filter...'
    }
    const sortButton = {
      className: 'btn--blank',
      icon: 'icon-sort-by',
      label: 'Sort by...'
    }
    return (
      <>
        <DropdownComponent button={filterButton}>
          <li className="menu__item">
            <div className="form-item">
              <label><input type="radio" name="some-filter" /> Some filter</label>
            </div>
          </li>
        </DropdownComponent>
        <DropdownComponent button={sortButton}>
          <li className="menu__item">
            <button className="btn btn--blank">Title</button>
          </li>
        </DropdownComponent>
      </>
    )
  }

  render() {
    return (
      <div role="main">
        <ToolbarComponent start={this.renderStart()} end={this.renderEnd()} />
        <ProjectsListContainer />
      </div>
    )
  }
}

export default ProjectsContainer
