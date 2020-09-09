/** @module renderer/components/account */

import { Button, Card, Form, Input, Layout, Space } from 'antd'

import { useUser } from '../../../src/api/user'

/**
 * Account
 */
const Account = () => {
  // Data
  const [form] = Form.useForm()
  const [user] = useUser()

  const onCancel = () => {
    form.resetFields()
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
        >
          <Form.Item label="User name" name="username">
            <Input />
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
            passwordConfirm: '*******'
          }}
        >
          <Form.Item label="Password" name="password">
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
    </Layout>
  )
}

export default Account
