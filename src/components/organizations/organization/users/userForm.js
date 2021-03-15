import { useState } from 'react'
import { Button, Form, Input, Space } from 'antd'
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'

/**
 * User form
 * @param {Object} props Props
 */
const UserForm = ({ type, label, onAdd }) => {
  // State
  const [add, setAdd] = useState(false)

  // Data
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 8 }
  }
  const tailLayout = {
    wrapperCol: { offset: 6, span: 8 }
  }

  /**
   * On finish
   * @param {string} t Type
   * @param {Object} v Values
   */
  const onFinish = async (t, v) => {
    await onAdd(t, v)
    setAdd(false)
  }

  return add ? (
    <Form {...layout} onFinish={(values) => onFinish(type, values)}>
      <Form.Item name="email" label={label}>
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button icon={<CheckOutlined />} htmlType="submit" />
          <Button
            type="danger"
            icon={<CloseOutlined />}
            onClick={() => setAdd(false)}
          />
        </Space>
      </Form.Item>
    </Form>
  ) : (
    <Button icon={<PlusOutlined />} onClick={() => setAdd(true)} />
  )
}

export default UserForm
