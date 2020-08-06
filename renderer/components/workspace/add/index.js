import React, { useState, useCallback } from 'react'
import { Button, Form, Input, Modal } from 'antd'

const AddPage = () => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)

  const toggleVisible = () => {
    setVisible(!visible)
  }

  const onOk = (values) => {
    toggleVisible()
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
