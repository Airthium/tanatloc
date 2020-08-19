import React, { useState } from 'react'
import { message, Button, Form, Input, Modal } from 'antd'

import { PlusCircleOutlined } from '@ant-design/icons'

import addWorkspace from '../../../../src/api/workspace/add'

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
        form.resetFields()
      })
      .catch((err) => {
        message.error(err.message)
        setLoading(false)
      })
  }

  const onCancel = () => {
    toggleVisible()
  }

  return (
    <>
      <Button onClick={toggleVisible} icon={<PlusCircleOutlined />}>Create a new workspace</Button>
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

export default AddPage
