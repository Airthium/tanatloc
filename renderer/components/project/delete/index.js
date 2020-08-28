import { useState } from 'react'
import { message, Button } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '../../assets/dialog'

import { useProjects, del } from '../../../../src/api/project'
import { useWorkspaces } from '../../../../src/api/workspace'

/**
 * Delete project
 * @memberof module:renderer/components/project
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
  const [, { delOneProject }] = useProjects(workspace.projects)
  const [, { mutateOneWorkspace }] = useWorkspaces()

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
      await del(workspace, project)

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
      message.error(err.message)
      console.error(err)
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button onClick={toggleDialog} icon={<DeleteOutlined />}>
        Delete
      </Button>
      <DeleteDialog
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
