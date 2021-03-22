import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Add errors
 * @memberof module:components/organizations
 */
const errors = {
  addError: 'Unable to add user'
}

/**
 * Add user
 * @memberof module:components/organizations
 * @param {Object} props Props
 */
const Add = ({ title, dBkey, organization, swr }) => {
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
      setVisible(false)
    } catch (err) {
      Error(errors.addError, err)
      setLoading(false)
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
        <Form.Item name="email" label="Email">
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
  dBkey: PropTypes.string.isRequired,
  organization: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired
}

export default Add
