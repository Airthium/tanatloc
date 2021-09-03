import { useEffect } from 'react'
import { Button, Card, Checkbox, Form, InputNumber, Space } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import {
  MIN_SIZE,
  MAX_SIZE,
  REQUIRE_LETTER,
  REQUIRE_NUMBER,
  REQUIRE_SYMBOL
} from '@/config/auth'

import Loading from '@/components/loading'
import {
  Success as SuccessNotification,
  Error as ErrorNotification
} from '@/components/assets/notification'

import SystemAPI from '@/api/system'

/**
 * Errors registration
 * @memberof module:components/administration
 */
const errors = {
  system: 'System error',
  update: 'Unable to update system'
}

/**
 * Registration
 * @memberof module:components/administration
 */
const Registration = () => {
  // Data
  const [form] = Form.useForm()
  const [system, { mutateSystem, errorSystem, loadingSystem }] =
    SystemAPI.useSystem()
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 }
  }
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 }
  }

  // System error
  useEffect(() => {
    if (errorSystem) ErrorNotification(errors.system, errorSystem)
  }, [errorSystem])

  // Effect
  useEffect(() => {
    if (!loadingSystem)
      form.setFieldsValue(
        system?.password || {
          min: MIN_SIZE,
          max: MAX_SIZE,
          requireLetter: REQUIRE_LETTER,
          requireNumber: REQUIRE_NUMBER,
          requireSymbol: REQUIRE_SYMBOL
        }
      )
  }, [loadingSystem, system?.password])

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
      ErrorNotification(errors.update, err)
    }
  }

  const onPasswordFinish = async (values) => {
    try {
      // Update
      await SystemAPI.update([{ key: 'password', value: values }])

      // Mutate
      mutateSystem({ password: values })

      SuccessNotification('Changes saved')
    } catch (err) {
      ErrorNotification(errors.update, err)
    }
  }

  /**
   * Render
   */
  if (loadingSystem) return <Loading.Simple />
  else
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        <Card title="Signup">
          <Checkbox checked={system?.allowsignup} onChange={onAllowSignup}>
            Allow signup
          </Checkbox>
        </Card>

        <Card title="Password">
          <Form {...layout} form={form} name="form" onFinish={onPasswordFinish}>
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
              <Button
                type="primary"
                icon={<CheckOutlined />}
                htmlType="submit"
              />
            </Form.Item>
          </Form>
        </Card>
      </Space>
    )
}

export default Registration
