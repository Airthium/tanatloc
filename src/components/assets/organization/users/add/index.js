import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Errors (add)
 * @memberof Components.Assets.Organization.Users
 */
const errors = {
  addError: 'Unable to add user'
}

/**
 * Add user
 * @memberof Components.Assets.Organization.Users
 * @param {Object} props Props
 *
 * @description
 * Props:
 * - title: Title
 * - organization: Organization `{ id, [dBkey] }`
 * - dBkey: Database key, must be `owners` or `users`
 */
const Add = ({ title, organization, dBkey, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On finish
   * @param {Object} v Values
   */
  const onFinish = async (values) => {
    setLoading(true)
    try {
      // API
      await OrganizationAPI.update(organization.id, [
        {
          key: dBkey,
          type: 'array',
          method: 'append',
          value: values.email
        }
      ])

      // Local
      const newOrganization = { ...organization }
      newOrganization[dBkey] = [
        ...(newOrganization[dBkey] || []),
        { email: values.email }
      ]
      swr.mutateOneOrganization(newOrganization)

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.addError, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title={title}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onFinish}
        loading={loading}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: '"Email" is required' }]}
        >
          <Input />
        </Form.Item>
      </Dialog>

      <Button icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        {title}
      </Button>
    </>
  )
}

Add.propTypes = {
  title: PropTypes.string.isRequired,
  organization: PropTypes.exact({
    id: PropTypes.string.isRequired,
    owners: PropTypes.array,
    users: PropTypes.array
  }).isRequired,
  dBkey: PropTypes.oneOf(['owners', 'users']),
  swr: PropTypes.exact({
    mutateOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Add
