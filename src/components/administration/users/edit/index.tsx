/** @module Components.Administration.User.Delete */

import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Checkbox, Form, Input, InputRef, Select } from 'antd'

import { IDataBaseEntry } from '@/database/index.d'
import { IFrontUsersItem, IFrontMutateUsersItem } from '@/api/index.d'
import { IClientPlugin } from '@/plugins/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'

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
    mutateOneUser: (user: IFrontMutateUsersItem) => Promise<void>
  }
}

/**
 * Local values
 */
export interface ILocalValues {
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
export const _onUpdate = async (
  user: TUserItem,
  values: ILocalValues,
  swr: { mutateOneUser: (user: IFrontMutateUsersItem) => Promise<void> },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    // Update
    const toUpdate = Object.keys(values)
      .map((key) => {
        const value = values[key as keyof ILocalValues]
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
    await swr.mutateOneUser(newUser as IFrontUsersItem)
  } catch (err: any) {
    dispatch(addError({ title: errors.update, err }))
    throw err
  }
}

/**
 * Edit
 * @param props Props
 * @returns Edit
 */
const Edit = ({ plugins, user, swr }: IProps): React.JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Autofocus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  /**
   * On update
   * @param values Values
   */
  const onUpdate = useCallback(
    async (values: ILocalValues): Promise<void> => {
      setLoading(true)
      try {
        await _onUpdate(user, values, swr, dispatch)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err) {
        setLoading(false)
        throw err
      }
    },
    [user, swr, dispatch]
  )

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
        onCancel={setVisibleFalse}
        onOk={onUpdate}
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

      <EditButton bordered onEdit={setVisibleTrue}>
        Edit
      </EditButton>
    </>
  )
}

export default Edit
