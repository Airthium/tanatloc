import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Checkbox, Form, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Edit errors
 * @memberof module:components/administration
 */
const errors = {
  updateError: 'Unable to update user'
}

/**
 * Edit
 * @memberof module:components/administration
 * @param {Object} props Props
 */
const Edit = ({ user, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On update
   * @param {Object} values Values
   */
  const onUpdate = async (values) => {
    setLoading(true)
    try {
      // Update
      const toUpdate = Object.keys(values)
        .map((key) => {
          const value = values[key]
          if (value !== undefined && value !== '******')
            return { key, value, type: key === 'password' && 'crypt' }
        })
        .filter((u) => u)
      await UserAPI.updateById(user.id, toUpdate)

      // Mutate
      const newUser = {
        ...user,
        ...values
      }
      delete newUser.password
      swr.mutateOneUser(newUser)

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Edit user"
        visible={visible}
        initialValues={user}
        onCancel={() => setVisible(false)}
        onOk={onUpdate}
        loading={loading}
      >
        <Form.Item
          name="firstname"
          label="First name"
          rules={[{ required: true, message: 'Please enter a first name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="lastname"
          label="Last name"
          rules={[{ required: true, message: 'Please enter a last name' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please enter an email' }]}
        >
          <Input />
        </Form.Item>
        <PasswordItem name="password" />
        <Form.Item
          name="superuser"
          label="Administrator"
          valuePropName="checked"
        >
          <Checkbox />
        </Form.Item>
      </Dialog>

      <Button icon={<EditOutlined />} onClick={() => setVisible(true)}>
        Edit
      </Button>
    </>
  )
}

Edit.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string.isRequired
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneUser: PropTypes.func.isRequired
  }).isRequired
}

export default Edit
