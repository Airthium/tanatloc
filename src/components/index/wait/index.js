import { useState } from 'react'
import { Button, Card, Form, Input, Typography } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import WaitAPI from '@/api/wait'

const Wait = () => {
  const [ok, setOk] = useState(false)

  const [form] = Form.useForm()

  const onFinish = async (values) => {
    setOk(true)
    try {
      if (!values.email) throw new Error('Empty email')

      await WaitAPI.add(values)

      form.resetFields()
    } catch (err) {
      console.error(err)
    } finally {
      setTimeout(() => setOk(false), 2000)
    }
  }

  return (
    <Card bordered={false} style={{ backgroundColor: 'white' }}>
      <Typography.Title level={2}>Tanatloc is coming soon!</Typography.Title>
      <Form onFinish={onFinish} layout="vertical" form={form}>
        <Form.Item
          label="Enter your email to be the first to test it"
          name="email"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            icon={ok && <CheckOutlined />}
            disabled={ok}
          >
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Wait
