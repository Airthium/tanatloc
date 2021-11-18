import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { IOrganizationWithData } from '@/lib/index.d'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

interface IProps {
  title: string
  organization: IOrganizationWithData
  dBkey: 'owners' | 'users'
  swr: {
    mutateOneOrganization: Function
  }
}

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
 * @param props Props
 * @description
 * Props:
 * - title (string) Title
 * - organization (Object) Organization `{ id, [dBkey] }`
 * - dBkey (string) Database key, must be `owners` or `users`
 * - swr (Object) SWR functions `{ mutateOneOrganization }`
 */
const Add = ({ title, organization, dBkey, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On finish
   * @param values Values
   */
  const onFinish = async (values: { email: string }): Promise<void> => {
    setLoading(true)
    try {
      // API
      await OrganizationAPI.update(organization, [
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
        visible={visible}
        loading={loading}
        title={title}
        onCancel={() => setVisible(false)}
        onOk={onFinish}
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
