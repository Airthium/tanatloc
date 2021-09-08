import { Button, Card, Form, Input, Typography } from 'antd'

import WaitAPI from '@/api/wait'

const Wait = () => {
  const onFinish = async (values) => {
    try {
      if (!values.email) throw new Error('Empty email')

      await WaitAPI.add(values)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Card bordered={false} style={{ backgroundColor: 'white' }}>
      <Typography.Title level={2}>Tanatloc is coming soon!</Typography.Title>
      <Form onFinish={onFinish} layout="vertical">
        <Form.Item
          label="Enter your email to be the first to test it"
          name="email"
        >
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  )
}

export default Wait
