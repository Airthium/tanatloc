import { useState } from 'react'
import { message, Button, Form, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import Dialog from '../../assets/dialog'

import { useWorkspaces, add } from '../../../../src/api/workspace'

/**
 * Add workspace
 * @memberof module:renderer/components/workspace
 */
const Add = () => {
  // Sate
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const [, { addOneWorkspace }] = useWorkspaces()

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
      const workspace = add(values)

      // Mutate
      addOneWorkspace(workspace)

      setLoading(false)
      toggleDialog()
    } catch (err) {
      message.error(err.message)
      console.error(err)
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
        title="Add a workspace"
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={loading}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: 'Please fill the name' }]}
        >
          <Input placeholder="Workspace's name" />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Add
