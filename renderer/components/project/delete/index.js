import { useState } from 'react'
import { message, Button, Modal, Space } from 'antd'
import { DeleteOutlined, ExclamationCircleTwoTone } from '@ant-design/icons'

import { useProjects, del } from '../../../../src/api/project'
import { useWorkspaces } from '../../../../src/api/workspace'

const Delete = (props) => {
  // Props
  const workspace = props.workspace
  const projectsIds = workspace.projects
  const project = props.project

  // Sate
  const [visible, setVisible] = useState(false)

  // Data
  const [projects, { mutateProjects }] = useProjects(projectsIds)
  const [workspaces, { mutateWorkspaces }] = useWorkspaces()

  /**
   * Toggle confirm delete
   */
  const toggleConfirm = () => {
    setVisible(!visible)
  }

  /**
   * Handle delete
   */
  const handleDelete = () => {
    del(workspace, project)
      .then(() => {
        // Mutate workspaces
        const newWorkspaces = workspaces.map((w) => {
          if (w.id === workspace.id) {
            //remove project
            const index = w.projects.findIndex((p) => p === project.id)
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

        toggleConfirm()
      })
      .catch((err) => {
        message.error(err.message)
      })
  }

  /**
   * Render
   */
  return (
    <>
      <Button onClick={toggleConfirm} icon={<DeleteOutlined />}>
        Delete
      </Button>
      <Modal
        className="ProjectDelete-confirm"
        okText={'Delete'}
        closable={false}
        onOk={handleDelete}
        onCancel={toggleConfirm}
        visible={visible}
      >
        <Space size="middle">
          <ExclamationCircleTwoTone
            twoToneColor="#faad14"
            style={{ fontSize: '1.5em' }}
          />
          <span>Delete {project.title}.</span>
        </Space>
      </Modal>
    </>
  )
}

export default Delete
