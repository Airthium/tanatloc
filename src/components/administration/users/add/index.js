import PropTypes from 'prop-types'
import { useState } from 'react'
import { notification, Button, Checkbox, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Add errors
 * @memberof module:components/administration
 */
const errors = {
  addError: 'Unable to add user'
}

/**
 * Add
 * @memberof module:components/administration
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
      const newUser = await UserAPI.add({
        email: values.email,
        password: values.password
      })
      if (newUser.alreadyExists) {
        notification.error('Use already exists')
        return
      }

      // Update informations
      await UserAPI.updateById(newUser.id, [
        {
          key: 'firstname',
          value: values.firstname
        },
        {
          key: 'lastname',
          value: values.lastname
        },
        {
          key: 'superuser',
          value: !!values.superuser
        }
      ])

      // Mutate
      newUser.email = values.email
      newUser.firstname = values.firstname
      newUser.lastname = values.lastname
      newUser.superuser = values.superuser
      swr.addOneUser(newUser)

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
        title="New user"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onAdd}
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

      <Button icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        New user
      </Button>
    </>
  )
}

Add.propTypes = {
  swr: PropTypes.shape({
    addOneUser: PropTypes.func.isRequired
  }).isRequired
}

export default Add
