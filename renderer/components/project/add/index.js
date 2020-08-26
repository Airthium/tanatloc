import { useState } from 'react'
import { message, Button, Form, Input, Modal } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Dialog from '../../assets/dialog'

import { useProjects, add } from '../../../../src/api/project'
import { useWorkspaces } from '../../../../src/api/workspace'

/**
 * Add project
 * @memberof module:renderer/components/project
 * @param {Object} props Props
 */
const Add = (props) => {
  // Props
  const workspace = props.workspace || {}

  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [projects, { mutateProjects }] = useProjects(workspace.projects)
  const [workspaces, { mutateWorkspaces }] = useWorkspaces()

  /**
   * Toggle dialog
   */
  const toggleDialog = () => {
    setVisible(!visible)
  }

  /**
   * On confirm
   * @param {Object} values Values
   */
  const onOk = async (values) => {
    setLoading(true)
    try {
      const project = await add({ id: workspace.id }, values)

      // Mutate projects
      projects.push(project)
      mutateProjects({ projects: projects })

      // Mutate workspaces
      const newWorkspaces = workspaces.map((w) => {
        if (w.id === workspace.id) w.projects.push(project.id)
        return w
      })
      mutateWorkspaces({ workspaces: newWorkspaces })

      setLoading(false)
      toggleDialog()
    } catch (err) {
      message.error(err.message)
      setLoading(false)
    }
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    toggleDialog()
  }

  return (
    <>
      <Button
        onClick={toggleDialog}
        type="primary"
        icon={<PlusCircleOutlined />}
      >
        Create a new project
      </Button>
      <Dialog
        title="Add a project"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        loading={loading}
      >
        <Form.Item
          label="Title"
          name="title"
          rules={[{ required: true, message: 'Please fill the title' }]}
        >
          <Input placeholder="Project's title" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Project's description" />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Add
