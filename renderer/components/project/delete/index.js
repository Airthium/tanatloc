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
  const [projects, { mutateProjects }] = useProjects(workspace.projects)
  const [workspaces, { mutateWorkspaces }] = useWorkspaces()

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
      await del(workspace, project)

      // Mutate workspaces
      const newWorkspaces = workspaces.map((w, index) => {
        if (w.id === workspace.id) {
          w.projects = [
            ...w.projects.slice(0, index),
            ...w.projects.slice(index + 1)
          ]
        }
        return w
      })
      mutateWorkspaces({ workspaces: newWorkspaces })

      // Mutate projects
      const newProjects = projects.filter((p) => p.id !== project.id)
      mutateProjects({ projects: newProjects })
    } catch (err) {
      message.error(err.message)
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
