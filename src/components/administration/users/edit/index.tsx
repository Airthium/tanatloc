import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Checkbox, Form, Input, Select } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import { IClientPlugin } from '@/database/index.d'

import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

export interface IProps {
  plugins: IClientPlugin[]
  user: {
    id: string
    firstname?: string
    lastname?: string
    email: string
    authorizedplugins?: string[]
    superuser?: boolean
  }
  swr: {
    mutateOneUser: Function
  }
}

/**
 * Errors (edit)
 * @memberof Components.Administration.Users
 */
const errors = {
  update: 'Unable to update user'
}

/**
 * Edit
 * @memberof Components.Administration.Users
 * @param props Props
 */
const Edit = ({ plugins, user, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On update
   * @param values Values
   */
  const onUpdate = async (values: {
    firstname: string
    lastname: string
    email: string
    password: string
    authorizedplugins: string[]
    superuser: boolean
  }): Promise<void> => {
    setLoading(true)
    try {
      // Update
      const toUpdate = Object.keys(values)
        .map((key) => {
          const value = values[key]
          if (value !== undefined && value !== '******' && value !== user[key])
            return { key, value, type: key === 'password' && 'crypt' }
        })
        .filter((u) => u)

      if (!toUpdate.length) {
        // Close
        setLoading(false)
        setVisible(false)
        return
      }

      await UserAPI.updateById(user.id, toUpdate)

      // Mutate
      const newUser = {
        ...user,
        ...values
      }
      delete newUser.password
      swr.mutateOneUser(newUser)

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      Error(errors.update, err)
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
        title="Edit user"
        visible={visible}
        initialValues={{
          ...user,
          password: '******',
          authorizedplugins: user.authorizedplugins || []
        }}
        onCancel={() => setVisible(false)}
        onOk={onUpdate}
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
        <PasswordItem name="password" edit={true} />
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

      <Button icon={<EditOutlined />} onClick={() => setVisible(true)}>
        Edit
      </Button>
    </>
  )
}

Edit.propTypes = {
  plugins: PropTypes.array.isRequired,
  user: PropTypes.exact({
    id: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    email: PropTypes.string.isRequired,
    authorizedplugins: PropTypes.array,
    superuser: PropTypes.bool
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneUser: PropTypes.func.isRequired
  }).isRequired
}

export default Edit
