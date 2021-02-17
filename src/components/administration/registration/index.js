import { Button, Card, Checkbox, Form, InputNumber } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import SystemAPI from '@/api/system'

import { Error } from '@/components/assets/notification'

const errors = {
  updateError: 'Unable to update system'
}

const Registration = () => {
  // Data
  const [system, { mutateSystem }] = SystemAPI.useSystem()
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
  }

  /**
   * On allow signup
   */
  const onAllowSignup = async () => {
    try {
      // Update
      await SystemAPI.update([
        { key: 'allowsignup', value: !system.allowsignup }
      ])

      // Mutate
      mutateSystem({ allowSignup: !system.allowsignup })
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  const onPasswordFinish = async (values) => {
    try {
      // Update
      await SystemAPI.update([{ key: 'password', value: values }])

      // Mutate
      mutateSystem({ password: values })
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Card title="Signup" className="Vertical-gutter">
        <Checkbox checked={system?.allowsignup} onChange={onAllowSignup}>
          Allow signup
        </Checkbox>
      </Card>

      <Card title="Password" className="Vertical-gutter">
        <Form
          {...layout}
          initialValues={system?.password}
          onFinish={onPasswordFinish}
        >
          <Form.Item
            label="Minimum number of characters"
            name="min"
            rules={[{ required: true, message: 'Please enter a value' }]}
          >
            <InputNumber min={0} max={64} />
          </Form.Item>
          <Form.Item
            label="Maximum number of characters"
            name="max"
            rules={[{ required: true, message: 'Please enter a value' }]}
          >
            <InputNumber min={0} max={64} />
          </Form.Item>
          <Form.Item
            {...tailLayout}
            valuePropName="checked"
            name="requireLetter"
          >
            <Checkbox>Require letter</Checkbox>
          </Form.Item>
          <Form.Item
            {...tailLayout}
            valuePropName="checked"
            name="requireNumber"
          >
            <Checkbox>Require number</Checkbox>
          </Form.Item>
          <Form.Item
            {...tailLayout}
            valuePropName="checked"
            name="requireSymbol"
          >
            <Checkbox>Require symbol</Checkbox>
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button type="primary" icon={<CheckOutlined />} htmlType="submit" />
          </Form.Item>
        </Form>
      </Card>
    </>
  )
}

export default Registration
