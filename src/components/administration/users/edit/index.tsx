/** @module Components.Administration.User.Delete */

import { useEffect, useRef, useState } from 'react'
import { Checkbox, Form, Input, InputRef, Select } from 'antd'

import { IDataBaseEntry } from '@/database/index.d'
import { IClientPlugin } from '@/plugins/index.d'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'
import { ErrorNotification } from '@/components/assets/notification'

import { IFrontUsersItem, IFrontMutateUsersItem } from '@/api/index.d'
import UserAPI from '@/api/user'

/**
 * Custom Types
 */
export type TUserItem = Pick<
  IFrontUsersItem,
  'id' | 'firstname' | 'lastname' | 'email' | 'authorizedplugins' | 'superuser'
>

/**
 * Props
 */
export interface IProps {
  plugins: IClientPlugin[]
  user: TUserItem
  swr: {
    mutateOneUser: (user: IFrontMutateUsersItem) => void
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
  user: TUserItem,
  values: IEditValues,
  swr: { mutateOneUser: (user: IFrontMutateUsersItem) => void }
): Promise<void> => {
  try {
    // Update
    const toUpdate = Object.keys(values)
      .map((key) => {
        const value = values[key as keyof IEditValues]
        if (
          value !== undefined &&
          value !== '******' &&
          value !== user[key as keyof TUserItem]
        )
          return { key, value, type: key === 'password' && 'crypt' }
      })
      .filter((u) => u)

    if (!toUpdate.length) return

    await UserAPI.updateById(user.id, toUpdate as IDataBaseEntry[])

    // Mutate
    values.password = '******'
    const newUser = {
      ...user,
      ...values
    }
    swr.mutateOneUser(newUser as IFrontUsersItem)
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
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Autofocus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  })

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
          <Input ref={inputRef} />
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

export default Edit
