/** @module Components.Administration.User.Add */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Checkbox, Form, Input, Select } from 'antd'

import { IClientPlugin } from '@/database/index.d'
import { IUserWithData } from '@/lib/index.d'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'
import { ErrorNotification } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Props
 */
export interface IProps {
  plugins: IClientPlugin[]
  swr: {
    addOneUser: (user: IUserWithData) => void
  }
}

/**
 * Add values
 */
export interface IAddValues {
  email: string
  password: string
  firstname: string
  lastname: string
  authorizedplugins: string[]
  superuser: boolean
}

/**
 * Errors
 */
const errors = {
  add: 'Unable to add user'
}

/**
 * On add
 * @param values Values
 * @param setLoading Set loading
 * @param setVisible Set visible
 * @param swr Swr
 */
export const onAdd = async (
  values: IAddValues,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setVisible: Dispatch<SetStateAction<boolean>>,
  swr: { addOneUser: (user: IUserWithData) => void }
): Promise<void> => {
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
    ErrorNotification(errors.add, err)
    setLoading(false)
    throw err
  }
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add = ({ plugins, swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="New user"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={async (values: IAddValues) =>
          onAdd(values, setLoading, setVisible, swr)
        }
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

      <AddButton onAdd={() => setVisible(true)}>New user</AddButton>
    </>
  )
}

Add.propTypes = {
  plugins: PropTypes.arrayOf(
    PropTypes.exact({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  swr: PropTypes.exact({
    addOneUser: PropTypes.func.isRequired
  }).isRequired
}

export default Add
