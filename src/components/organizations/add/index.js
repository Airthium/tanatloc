import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input, Typography } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Add errors
 * @memberof module:components/organizations
 */
const errors = {
  addError: 'Unable to add organization'
}

/**
 * Add
 * @memberof module:components/organizations
 * @param {Object} props Props
 */
const Add = ({ swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On add
   * @param {Object} values Values
   */
  const onAdd = async (values) => {
    setLoading(true)

    try {
      // API
      const organization = await OrganizationAPI.add({ name: values.name })

      // Local
      organization.name = values.name
      organization.owners = []
      swr.addOneOrganization(organization)

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.addError, err)
      setLoading(false)
    }
  }

  return (
    <>
      <Dialog
        title="New organization"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onAdd}
        loading={loading}
      >
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
      </Dialog>

      <Button icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        New organization
      </Button>
    </>
  )
}

Add.propTypes = {
  swr: PropTypes.shape({
    addOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Add
