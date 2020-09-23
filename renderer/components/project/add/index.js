import { useState } from 'react'
import { message, Button, Form, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Dialog from '../../assets/dialog'

import { useProjects, add } from '../../../../src/api/project'
import { useWorkspaces } from '../../../../src/api/workspace'

import Sentry from '../../../../src/lib/sentry'

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
  const [, { addOneProject }] = useProjects(workspace.projects)
  const [, { mutateOneWorkspace }] = useWorkspaces()

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
      // Add
      const project = await add({ id: workspace.id }, values)

      // Mutate projects
      addOneProject(project)

      // Mutate workspaces
      workspace.projects.push(project.id)
      mutateOneWorkspace(workspace)

      toggleDialog()
    } catch (err) {
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    toggleDialog()
  }

  /**
   * Render
   */
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
