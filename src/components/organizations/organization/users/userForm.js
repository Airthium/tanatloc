import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'

/**
 * User form
 * @param {Object} props Props
 */
const UserForm = ({ type, label, onAdd }) => {
  const [add, setAdd] = useState(false)

  const onFinish = async (t, v) => {
    await onAdd(t, v)
    setAdd(false)
  }

  return add ? (
    <Form onFinish={(values) => onFinish(type, values)}>
      <Form.Item name="emails" label={label}>
        <Input />
      </Form.Item>
      <Form.Item>
        <Button icon={<CheckOutlined />} htmlType="submit" />
        <Button
          type="danger"
          icon={<CloseOutlined />}
          onClick={() => setAdd(false)}
        />
      </Form.Item>
    </Form>
  ) : (
    <Button icon={<PlusOutlined />} onClick={() => setAdd(true)} />
  )
}

export default UserForm
