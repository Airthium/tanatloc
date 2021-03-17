import { useState } from 'react'
import { Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'
import { DeleteDialog } from '@/components/assets/dialog'

import ProjectAPI from '@/api/project'
import WorkspaceAPI from '@/api/workspace'

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
const Delete = (props) => {
  // Props
  const workspace = props.workspace || {}
  const project = props.project || {}

  // Sate
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [, { delOneProject }] = ProjectAPI.useProjects(workspace.projects)
  const [, { mutateOneWorkspace }] = WorkspaceAPI.useWorkspaces()

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
      mutateOneWorkspace(workspace)

      // Mutate projects
      delOneProject({ id: project.id })
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

export default Delete
