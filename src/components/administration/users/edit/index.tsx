/** @module Components.Administration.User.Delete */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Checkbox, Form, Input, Select } from 'antd'

import { IClientPlugin, IDataBaseEntry } from '@/database/index.d'
import { IUserWithData } from '@/lib/index.d'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'
import { ErrorNotification } from '@/components/assets/notification'

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
    authorizedplugins: string[]
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
export const errors = {
  update: 'Unable to update user'
}

/**
 * On update
 * @param user User
 * @param values Values
 * @param swr Swr
 */
export const onUpdate = async (
  user: IUserWithData,
  values: IEditValues,
  swr: { mutateOneUser: (user: IUserWithData) => void }
): Promise<void> => {
  try {
    // Update
    const toUpdate = Object.keys(values)
      .map((key) => {
        const value = values[key as keyof IEditValues]
        if (
          value !== undefined &&
          value !== '******' &&
          value !== user[key as keyof IUserWithData]
        )
          return { key, value, type: key === 'password' && 'crypt' }
      })
      .filter((u) => u)

    if (!toUpdate.length) return

    await UserAPI.updateById(user.id as string, toUpdate as IDataBaseEntry[])

    // Mutate
    values.password = '******'
    const newUser = {
      ...user,
      ...values
    }
    swr.mutateOneUser(newUser)
  } catch (err) {
    ErrorNotification(errors.update, err)
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
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

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
          authorizedplugins: user.authorizedplugins
        }}
        onCancel={() => setVisible(false)}
        onOk={async (values: IEditValues) => {
          setLoading(true)
          try {
            await onUpdate(user, values, swr)

            // Close
            setLoading(false)
            setVisible(false)
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
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

      <EditButton bordered onEdit={() => setVisible(true)}>
        Edit
      </EditButton>
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
    authorizedplugins: PropTypes.arrayOf(PropTypes.string).isRequired,
    superuser: PropTypes.bool.isRequired
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneUser: PropTypes.func.isRequired
  }).isRequired
}

export default Edit
