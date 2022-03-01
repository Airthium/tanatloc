/** @module Components.Administration.User.Delete */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Checkbox, Form, Input, Select } from 'antd'

import { IClientPlugin } from '@/database/index.d'
import { IUserWithData } from '@/lib/index.d'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'
import { Error } from '@/components/assets/notification'

import UserAPI from '@/api/user'

/**
 * Props
 */
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
    mutateOneUser: (user: IUserWithData) => void
  }
}

/**
 * Edit values
 */
export interface IEditValues {
  firstname: string
  lastname: string
  email: string
  password: string
  authorizedplugins: string[]
  superuser: boolean
}

/**
 * Errors
 */
const errors = {
  update: 'Unable to update user'
}

/**
 * On update
 * @param user User
 * @param values Values
 * @param setLoading Set loading
 * @param setVisible Set visible
 * @param swr Swr
 */
export const onUpdate = async (
  user: IUserWithData,
  values: IEditValues,
  setLoading: Dispatch<SetStateAction<boolean>>,
  setVisible: Dispatch<SetStateAction<boolean>>,
  swr: { mutateOneUser: (user: IUserWithData) => void }
): Promise<void> => {
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
 * Edit
 * @param props Props
 * @returns Edit
 */
const Edit = ({ plugins, user, swr }: IProps): JSX.Element => {
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
        title="Edit user"
        visible={visible}
        initialValues={{
          ...user,
          password: '******',
          authorizedplugins: user.authorizedplugins || []
        }}
        onCancel={() => setVisible(false)}
        onOk={async (values: IEditValues) =>
          onUpdate(user, values, setLoading, setVisible, swr)
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

      <EditButton onEdit={() => setVisible(true)}>Edit</EditButton>
    </>
  )
}

Edit.propTypes = {
  plugins: PropTypes.arrayOf(
    PropTypes.exact({
      key: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired
    })
  ).isRequired,
  user: PropTypes.exact({
    id: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    firstname: PropTypes.string,
    lastname: PropTypes.string,
    authorizedplugins: PropTypes.array.isRequired,
    superuser: PropTypes.bool.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneUser: PropTypes.func.isRequired
  }).isRequired
}

export default Edit
