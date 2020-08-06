import React, { useState } from 'react'
import { Button, Form, Input, Modal } from 'antd'

import addWorkspace from '../../../../src/api/workspace/addWorkspace'

const AddPage = () => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  const onOk = (values) => {
    setLoading(true)
    addWorkspace(values)
      .then(() => {
        setLoading(false)
        toggleVisible()
      })
      .catch((err) => {
        console.error(err)
        setLoading(true)
      })
  }

  const onCancel = () => {
    toggleVisible()
  }

  return (
    <>
      <Button onClick={toggleVisible}>Create a new workspace</Button>
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
              form.resetFields()
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

export default AddPage
