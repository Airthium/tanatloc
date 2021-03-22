import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'
import { DeleteDialog } from '@/components/assets/dialog'

import ProjectAPI from '@/api/project'

/**
 * Errors project/del
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
const Delete = ({ workspace, project, swr }) => {
  // Sate
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * Toggle dialog delete
   */
  const toggleDialog = () => {
    setVisible(!visible)
  }

  /**
   * Handle delete
   */
  const handleDelete = async () => {
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
      <Button type="danger" onClick={toggleDialog} icon={<DeleteOutlined />}>
        Delete
      </Button>
      <DeleteDialog
        title="Delete the project"
        visible={visible}
        onCancel={toggleDialog}
        onOk={handleDelete}
        loading={loading}
      >
        Delete {project.title}
      </DeleteDialog>
    </>
  )
}

Delete.propTypes = {
  workspace: PropTypes.object.isRequired,
  project: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired
}

export default Delete
