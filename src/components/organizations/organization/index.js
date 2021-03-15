import { useEffect } from 'react'
import { Button, Form, Input, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import { EmailsInput } from '@/components/assets/input'

/**
 * Organization
 * @param {Object} props Props
 */
const Organization = ({ organization, onClose }) => {
  // Data
  const [form] = Form.useForm()
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 }
  }
  const tailLayout = {
    wrapperCol: { offset: 4, span: 12 }
  }

  // Effect
  useEffect(() => {
    form.setFieldsValue(organization)
  }, [organization])

  /**
   * Render
   */
  return (
    <Form form={form} {...layout}>
      <Form.Item name="name" label="Name">
        <Input />
      </Form.Item>
      <Form.Item name="owners" label="Administrators" valuePropName="values">
        <EmailsInput />
      </Form.Item>
      <Form.Item name="users" label="Users" valuePropName="values">
        <EmailsInput />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button type="primary" icon={<CheckOutlined />} />
          <Button type="danger" icon={<CloseOutlined />} onClick={onClose} />
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Organization
