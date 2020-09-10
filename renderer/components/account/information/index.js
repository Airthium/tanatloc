import { useState } from 'react'
import { message, Button, Form, Input, Space } from 'antd'

import { useUser, update } from '../../../../src/api/user'

/**
 * Information
 * @memberof module:renderer/components/account
 */
const Information = () => {
  // State
  const [loading, setLoading] = useState(false)

  // Form
  const [form] = Form.useForm()

  // Data
  const [user, { mutateUser }] = useUser()

  // Layout
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 14, span: 6 }
  }

  /**
   * On finish
   * @param {Object} data Data
   */
  const onFinish = (data) => {
    const toUpdate = []
    // TODO disable for now
    // if (data.username !== user.email)
    //   toUpdate.push({ key: 'email', value: data.username })
    if (data.firstname !== user.firstname)
      toUpdate.push({ key: 'firstname', value: data.firstname })
    if (data.lastname !== user.lastname)
      toUpdate.push({ key: 'lastname', value: data.lastname })
    if (data.email !== user.email)
      toUpdate.push({ key: 'email', value: data.email })

    update(toUpdate)
      .then(() => {
        // Mutate user
        mutateUser({
          user: {
            ...user,
            firstname: data.firstname,
            lastname: data.lastname,
            email: data.email
          }
        })
      })
      .catch((err) => {
        message.error(err.message)
        console.error(err)
      })
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    form.resetFields()
  }

  return (
    <Form
      {...layout}
      form={form}
      initialValues={{
        username: user.email,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email
      }}
      onFinish={onFinish}
      name="personalForm"
    >
      <Form.Item label="User name" name="username">
        <Input disabled={true} />
        {/* Disabled for now (add username in dB) */}
      </Form.Item>
      <Form.Item label="First name" name="firstname">
        <Input />
      </Form.Item>
      <Form.Item label="Last name" name="lastname">
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <Form.Item {...buttonLayout} style={{ textAlign: 'right' }}>
        <Space>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" loading={loading}>
            Apply changes
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Information
