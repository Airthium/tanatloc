import { useState } from 'react'
import { Form, Input } from 'antd'

import Dialog from '@/components/assets/dialog'

const Edit = ({ visible, geometry, setVisible, onEdit }) => {
  // State
  const [loading, setLoading] = useState(false)

  /**
   * On ok
   * @param {Object} values Values
   */
  const onOk = async (values) => {
    setLoading(true)

    await onEdit({ name: values.name })

    setLoading(false)
    setVisible(false)
  }
  return (
    <Dialog
      title="Edit the geometry's name"
      visible={visible}
      initialValues={{ name: geometry.name }}
      onCancel={() => setVisible(false)}
      onOk={onOk}
      loading={loading}
    >
      <Form.Item
        name="name"
        label="Name:"
        rules={[{ required: true, message: 'A name is required' }]}
      >
        <Input />
      </Form.Item>
    </Dialog>
  )
}

export default Edit
