import { useState } from 'react'
import { message, Button, Form, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Dialog from '../../assets/dialog'

import ProjectAPI from '../../../../src/api/project'
import WorkspaceAPI from '../../../../src/api/workspace'

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
  const [, { addOneProject }] = ProjectAPI.useProjects(workspace.projects)
  const [, { mutateOneWorkspace }] = WorkspaceAPI.useWorkspaces()

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
      const project = await ProjectAPI.add({ id: workspace.id }, values)

      // Mutate projects
      addOneProject(project)

      // Mutate workspaces
      mutateOneWorkspace({
        ...workspace,
        projects: [...workspace.projects, project.id]
      })

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
        title="Create a new project"
        closable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        loading={loading}
      >
        <Form.Item
          label="Name"
          name="title"
          rules={[{ required: true, message: "Please enter a project's name" }]}
        >
          <Input placeholder="Project's name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Project's description" />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Add
