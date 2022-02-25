/** @module Components.Administration.User.Add */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Checkbox, Form, Input, Select } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import { IClientPlugin } from '@/database/index.d'

import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'
import { Error as ErrorNotification } from '@/components/assets/notification'

import UserAPI from '@/api/user'

export interface IProps {
  plugins: IClientPlugin[]
  swr: {
    addOneUser: Function
  }
}

/**
 * Errors (add)
 */
const errors = {
  add: 'Unable to add user'
}

/**
 * Add
 * @param props Props
 */
const Add = ({ plugins, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On add
   * @param values Values
   */
  const onAdd = async (values: {
    email: string
    password: string
    firstname: string
    lastname: string
    authorizedplugins: string[]
    superuser: boolean
  }): Promise<void> => {
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
      const newUserWithData = {
        ...newUser,
        email: values.email,
        firstname: values.firstname,
        lastname: values.firstname,
        superuser: values.superuser
      }
      swr.addOneUser(newUserWithData)

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
          rules={[{ required: true, message: 'Email is required' }]}
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
