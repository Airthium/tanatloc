import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

/**
 * Errors project/delete
 * @memberof module:components/project
 */
const errors = {
  delError: 'Unable to delete the project'
}

/**
 * Delete project
 * @memberof module:components/project
 * @param {Object} props Props
 */
const Delete = ({ disabled, workspace, project, swr }) => {
  // Sate
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On delete
   */
  const onDelete = async () => {
    setLoading(true)
    try {
      // Delete
      await ProjectAPI.del(workspace, project)

      // Mutate workspaces
      const index = workspace.projects.findIndex((p) => p.id === project.id)
      workspace.projects = [
        ...workspace.projects.slice(0, index),
        ...workspace.projects.slice(index + 1)
      ]
      swr.mutateOneWorkspace(workspace)

      // Mutate projects
      swr.delOneProject({ id: project.id })

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.delError, err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button
        disabled={disabled}
        type="danger"
        onClick={() => setVisible(true)}
        icon={<DeleteOutlined />}
      />
      <DeleteDialog
        title="Delete the project"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onDelete}
        loading={loading}
      >
        Delete {project.title}
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  disabled: PropTypes.bool,
  workspace: PropTypes.exact({
    projects: PropTypes.array.isRequired
  }).isRequired,
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneWorkspace: PropTypes.func.isRequired,
    delOneProject: PropTypes.func.isRequired
  }).isRequired
}

export default Delete
