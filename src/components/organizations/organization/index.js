import { useState, useEffect } from 'react'
import { Button, Form, Input, Space } from 'antd'
import { CheckOutlined, CloseOutlined } from '@ant-design/icons'

import { EmailsInput } from '@/components/assets/input'

import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

const errors = {
  updateError: 'Unable to update organization'
}

/**
 * Organization
 * @param {Object} props Props
 */
const Organization = ({ organization, onClose }) => {
  // State
  const [loading, setLoading] = useState(false)

  // Data
  const [, { mutateOneOrganization }] = OrganizationAPI.useOrganizations()
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
    form.setFieldsValue({
      name: organization?.name,
      owners: organization?.owners?.map((o) => o.email),
      users: organization?.users?.map((u) => u.email)
    })
  }, [organization])

  /**
   * On finish
   * @param {Object} values Values
   */
  const onFinish = async (values) => {
    setLoading(true)

    try {
      // API
      await OrganizationAPI.update({ id: organization.id }, [
        {
          key: 'name',
          value: values.name
        },
        {
          key: 'owners',
          value: values.owners
        },
        {
          key: 'users',
          value: values.users
        }
      ])

      // Local
      mutateOneOrganization({
        ...organization,
        owners: values.owners?.map((o) => ({ email: o })),
        users: values.users?.map((u) => ({ email: u }))
      })

      // Close
      onClose()
    } catch (err) {
      Error(errors.updateError, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * Render
   */
  return (
    <Form form={form} {...layout} onFinish={onFinish}>
      <Form.Item
        name="name"
        label="Name"
        rules={[{ required: true, message: 'Please enter a name' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="owners"
        label="Administrators"
        valuePropName="values"
        rules={[
          { required: true, message: 'Please add at least one administrator' }
        ]}
      >
        <EmailsInput />
      </Form.Item>
      <Form.Item name="users" label="Users" valuePropName="values">
        <EmailsInput />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Space>
          <Button
            loading={loading}
            type="primary"
            icon={<CheckOutlined />}
            htmlType="submit"
          />
          <Button type="danger" icon={<CloseOutlined />} onClick={onClose} />
        </Space>
      </Form.Item>
    </Form>
  )
}

export default Organization
