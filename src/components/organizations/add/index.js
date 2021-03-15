import { useState } from 'react'
import { Button, Form, Input, Space, Typography } from 'antd'
import { CheckOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

const errors = {
  addError: 'Unable to add organization'
}

/**
 * Add
 * @memberof module:components/organizations
 */
const Add = () => {
  // State
  const [add, setAdd] = useState(false)
  const [loading, setLoading] = useState(false)

  // Data
  const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 12 }
  }
  const tailLayout = {
    wrapperCol: { offset: 4, span: 12 }
  }
  const [, { addOneOrganization }] = OrganizationAPI.useOrganizations()

  /**
   * On add
   * @param {Object} values Values
   */
  const onAdd = async (values) => {
    setLoading(true)
    try {
      // Add
      const organization = await OrganizationAPI.add({ name: values.name })
      organization.name = values.name

      // Mutate
      addOneOrganization(organization)

      // Close
      setAdd(false)
    } catch (err) {
      Error(errors.addError, err)
    } finally {
      setLoading(false)
    }
  }

  return add ? (
    <Form {...layout} onFinish={onAdd}>
      <Form.Item>
        <Typography.Title level={5}>New organization</Typography.Title>
      </Form.Item>
      <Form.Item
        name="name"
        label="Name"
        rules={[
          { required: true, message: 'Please enter an organization name' }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button
            icon={<CloseOutlined />}
            type="danger"
            onClick={() => setAdd(false)}
          />
          <Button
            loading={loading}
            icon={<CheckOutlined />}
            type="primary"
            htmlType="submit"
          />
        </Space>
      </Form.Item>
    </Form>
  ) : (
    <Button icon={<PlusOutlined />} onClick={() => setAdd(true)}>
      New organization
    </Button>
  )
}

export default Add
