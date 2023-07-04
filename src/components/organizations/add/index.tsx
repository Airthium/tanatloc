/** @module Components.Organizations.Add */

import {
  Dispatch,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Form, Input, InputRef } from 'antd'

import { IFrontNewOrganization } from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'

import OrganizationAPI from '@/api/organization'

/**
 * Props
 */
export interface IProps {
  swr: {
    addOneOrganization: (organization: IFrontNewOrganization) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  add: 'Unable to add organization'
}

/**
 * On add
 * @param values Values
 * @param swr SWR
 */
export const _onAdd = async (
  values: { name: string },
  swr: {
    addOneOrganization: (origanization: IFrontNewOrganization) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    // API
    const organization = await OrganizationAPI.add({ name: values.name })

    // Local
    organization.name = values.name
    await swr.addOneOrganization(organization)
  } catch (err: any) {
    dispatch(addError({ title: errors.add, err }))
    throw err
  }
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add = ({ swr }: IProps): React.JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Autofocus
  useEffect(() => {
    /* istanbul ignore next */
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => setVisible(false), [])

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: { name: string }): Promise<void> => {
      setLoading(true)
      try {
        await _onAdd(values, swr, dispatch)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err) {
        setLoading(false)
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
        title="New organization"
        visible={visible}
        onCancel={setVisibleFalse}
        onOk={onOk}
        loading={loading}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input ref={inputRef} />
        </Form.Item>
      </Dialog>

      <AddButton onAdd={setVisibleTrue}>New organization</AddButton>
    </>
  )
}

export default Add
