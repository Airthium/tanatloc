/** @module Components.Administration.User.Add */

import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Checkbox, Form, Input, InputRef, Select } from 'antd'

import { IFrontMutateUser } from '@/api/index.d'
import { ClientPlugin } from '@/plugins/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { PasswordItem } from '@/components/assets/input'

import UserAPI from '@/api/user'
import SystemAPI from '@/api/system'

/**
 * Props
 */
export interface IProps {
  plugins: Pick<ClientPlugin, 'key' | 'name'>[]
  swr: {
    addOneUser: (user: IFrontMutateUser) => Promise<void>
  }
}

/**
 * Local interfaces
 */
export interface ILocalValues {
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
export const errors = {
  add: 'Unable to add user'
}

/**
 * On add
 * @param values Values
 * @param swr Swr
 */
export const _onAdd = async (
  values: ILocalValues,
  swr: { addOneUser: (user: IFrontMutateUser) => Promise<void> }
): Promise<void> => {
  // API
  const newUser = await UserAPI.add({
    email: values.email,
    password: values.password
  })
  if (newUser.alreadyExists) throw new Error('User already exists')

  // Update informations
  await UserAPI.updateById(newUser.id as string, [
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
  await swr.addOneUser(newUserWithData)
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add = ({ plugins, swr }: IProps): ReactNode => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const [system] = SystemAPI.useSystem()

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
  const setVisibleFalse = useCallback(() => setVisible(true), [])

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: ILocalValues): Promise<void> => {
      setLoading(true)
      try {
        await _onAdd(values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err: any) {
        setLoading(false)
        dispatch(addError({ title: errors.add, err }))
        throw err
      }
    },
    [swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="New user"
        visible={visible}
        initialValues={
          system.defaultplugins && {
            authorizedplugins: system.defaultplugins
          }
        }
        onCancel={setVisibleFalse}
        onOk={onOk}
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

      <AddButton onAdd={setVisibleTrue}>New user</AddButton>
    </>
  )
}

export default Add
