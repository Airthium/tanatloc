import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import {
  message,
  Button,
  Card,
  Checkbox,
  Form,
  Input,
  Layout,
  Space
} from 'antd'

import login from '../../../src/api/login'
import { useUser } from '../../../src/auth/useUser'

const errors = {
  BAD_CREDENTIALS: 'Login failed. Please check your username and password'
}

const LoginPage = () => {
  // State
  const [checking, setChecking] = useState(false)
  const [user, { mutate }] = useUser()

  // Router
  const router = useRouter()

  // On login
  const onLogin = async (values) => {
    // State
    setChecking(true)

    // Check
    const loggedUser = await login(values)
    if (loggedUser) {
      mutate(loggedUser)
      router.push('/dashboard')
    } else {
      message.error(errors.BAD_CREDENTIALS)
      setChecking(false)
    }
  }

  useEffect(() => {
    if (user) router.push('/dashboard')
  }, [user])

  // Render
  return (
    <Layout>
      <Card className="Login">
        <Space direction="vertical" size="large">
          <img src="/images/banner.png" />
          <Form initialValues={{ remember: true }} onFinish={onLogin}>
            <Form.Item
              name="username"
              rules={[
                { required: true, message: 'Please fill your Username!' }
              ]}
            >
              <Input placeholder="username" autoComplete="username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                { required: true, message: 'Please fill your Password!' }
              ]}
            >
              <Input.Password
                placeholder="password"
                autoComplete="current-password"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>remember me</Checkbox>
              </Form.Item>

              <a className="Login-forgot" href="">
                forgot password
              </a>
            </Form.Item>
            <Form.Item className="Login-submit">
              <Button type="primary" loading={checking} htmlType="submit">
                Log in
              </Button>
              <a href="">or register now!</a>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </Layout>
  )
}

export default LoginPage
