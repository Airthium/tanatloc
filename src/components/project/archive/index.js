import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'
import { HddOutlined, ImportOutlined } from '@ant-design/icons'

const Archive = ({ disabled, workspace, project, swr }) => {
  // TODO
  // logic

  /**
   * Render
   */
  return (
    <Tooltip title={project.archived ? 'Restore' : 'Archive'}>
      <Button
        type="link"
        icon={project.archived ? <ImportOutlined /> : <HddOutlined />}
      />
    </Tooltip>
  )
}

Archive.propTypes = {
  disabled: PropTypes.bool,
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired,
    projects: PropTypes.array.isRequired
  }).isRequired,
  project: PropTypes.exact({
    archived: PropTypes.bool,
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneWorkspace: PropTypes.func.isRequired,
    delOneProject: PropTypes.func.isRequired
  }).isRequired
}

export default Archive
