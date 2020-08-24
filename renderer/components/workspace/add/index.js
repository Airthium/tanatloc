import React, { useState } from 'react'
import { message, Button, Form, Input, Modal } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import { useWorkspaces, add } from '../../../../src/api/workspace'

/**
 * Add workspace
 * @memberof module:renderer/components/workspace
 */
const Add = () => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [workspaces, { mutateWorkspaces }] = useWorkspaces()

  /**
   * Toggle form visibility
   */
  const toggleVisible = () => {
    setVisible(!visible)
  }

  /**
   * On confirm
   * @param {Object} values Values
   */
  const onOk = (values) => {
    setLoading(true)
    add(values)
      .then((workspace) => {
        // Mutate
        workspaces.push(workspace)
        mutateWorkspaces({ workspaces: workspaces })

        setLoading(false)
        toggleVisible()
        form.resetFields()
      })
      .catch((err) => {
        message.error(err.message)
        setLoading(false)
      })
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    toggleVisible()
  }

  /**
   * Render
   */
  return (
    <>
      <Button onClick={toggleVisible} icon={<PlusCircleOutlined />}>
        Create a new workspace
      </Button>
      <Modal
        title="Add a workspace"
        visible={visible}
        onCancel={() => {
          form.resetFields()
          onCancel()
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onOk(values)
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })
        }}
        confirmLoading={loading}
      >
        <Form form={form}>
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: 'Please fill the name' }]}
          >
            <Input placeholder="Workspace name" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Add
