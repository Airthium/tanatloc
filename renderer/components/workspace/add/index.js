import { useState } from 'react'
import { message, Button, Form, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Dialog from '../../assets/dialog'

import WorkspaceAPI from '../../../../src/api/workspace'

import Sentry from '../../../../src/lib/sentry'

const errors = {
  addError: 'Unable to add the workspace'
}

/**
 * Add workspace
 * @memberof module:renderer/components/workspace
 */
const Add = () => {
  // Sate
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [, { addOneWorkspace }] = WorkspaceAPI.useWorkspaces()

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
      const workspace = await WorkspaceAPI.add(values)

      // Mutate
      addOneWorkspace(workspace)

      toggleDialog()
    } catch (err) {
      message.error(errors.addError)
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
      <Button onClick={toggleDialog} icon={<PlusCircleOutlined />}>
        Create a new workspace
      </Button>
      <Dialog
        title="Create a new workspace"
        closable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={loading}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter a workspace's name" }
          ]}
        >
          <Input placeholder="Workspace's name" />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Add
