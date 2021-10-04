import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Checkbox, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'
import { Error as ErrorNotification } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Errors (add)
 * @memberof Components.Administration.Users
 */
const errors = {
  add: 'Unable to add user'
}

/**
 * Add
 * @memberof Components.Administration.Users
 * @param {Object} props Props
 */
const Add = ({ plugins, swr }) => {
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
      if (newUser.alreadyExists) throw new Error('User already exists')

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
          key: 'authorizedplugins',
          value: values.authorizedplugins
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
      setLoading(false)
      setVisible(false)
    } catch (err) {
      setLoading(false)
      ErrorNotification(errors.add, err)
      throw err
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
        <Form.Item name="firstname" label="First name">
          <Input />
        </Form.Item>
        <Form.Item name="lastname" label="Last name">
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
        <Form.Item name="authorizedplugins" label="Plugins">
          <Select
            mode="multiple"
            options={plugins.map((plugin) => ({
              label: plugin.name,
              value: plugin.key
            }))}
          />
        </Form.Item>
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
  plugins: PropTypes.array.isRequired,
  swr: PropTypes.exact({
    addOneUser: PropTypes.func.isRequired
  }).isRequired
}

export default Add
