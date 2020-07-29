import { useRouter } from 'next/router'
import { useState } from 'react'
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

import login from '../../src/lib/api/user/login'

import { useDispatch, useSelector } from 'react-redux'
import { login as reduxLogin } from '../store/auth/action'

const errors = {
  BAD_CREDENTIALS: 'Bad credentials. Please check your username and password'
}

// Login page
export default () => {
  // State
  const [checking, setChecking] = useState(false)

  // Router
  const router = useRouter()

  // Redux
  const dispatch = useDispatch()

  // Check user
  const { user } = useSelector((store) => store.auth)
  if (typeof window !== 'undefined' && user.id) {
    // Go to dashboard
    router.push('/dashboard')
  }

  // On login
  const onLogin = async (values) => {
    // State
    setChecking(true)

    // Check
    const check = await login(values)

    // Authorized or not
    if (check.authorized) {
      dispatch(
        reduxLogin({
          username: values.username,
          id: check.id
        })
      )
      router.push('/dashboard')
    } else {
      message.error(errors.BAD_CREDENTIALS)
      setChecking(false)
    }
  }

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
