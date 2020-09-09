/** @module renderer/components/account */

import { message, Button, Card, Form, Input, Layout, Space } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import Delete from './delete'

import { useUser, update } from '../../../src/api/user'

/**
 * Account
 */
const Account = () => {
  // Data
  const [form] = Form.useForm()
  const [user, { mutateUser }] = useUser()

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
        // // Update user
        // user.firstname = firstname
        // user.lastname = lastname
        // user.email = email
        // // Mutate user
        // mutateUser(user)
        // TODO cause a logout / login
      })
      .catch((err) => {
        message.error(err.message)
        console.error(err)
      })
  }

  const onCancel = () => {
    form.resetFields()
  }

  const onPasswordFinish = (data) => {
    console.log(data)
    if (data.newPassword === data.passwordConfirm) {
      // Check current password
      //update password
    } else {
      message.error('Password and confirmation mismatch')
    }
  }

  // Layout
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 }
  }
  const buttonLayout = {
    wrapperCol: { offset: 14, span: 6 }
  }

  /**
   * Render
   */
  return (
    <Layout className="Account">
      <Card title="Personal information">
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
        >
          <Form.Item label="User name" name="username">
            <Input disabled={true} />
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
              <Button type="primary" htmlType="submit">
                Apply changes
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Form
          {...layout}
          initialValues={{
            password: '******',
            newPassword: '******',
            passwordConfirm: '*******'
          }}
          onFinish={onPasswordFinish}
        >
          <Form.Item label="Current password" name="password">
            <Input.Password />
          </Form.Item>
          <Form.Item label="New password" name="newPassword">
            <Input.Password />
          </Form.Item>
          <Form.Item label="Password confirmation" name="passwordConfirm">
            <Input.Password />
          </Form.Item>
          <Form.Item {...buttonLayout} style={{ textAlign: 'right' }}>
            <Space>
              <Button type="primary" htmlType="submit">
                Modify password
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
      <Delete />
    </Layout>
  )
}

export default Account
