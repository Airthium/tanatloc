/** @module Components.Organizations.Add */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'

import { IFrontNewOrganization } from '@/api/index.d'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

/**
 * Props
 */
export interface IProps {
  swr: {
    addOneOrganization: (organization: IFrontNewOrganization) => void
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
  swr: { addOneOrganization: (origanization: IFrontNewOrganization) => void }
): Promise<void> => {
  try {
    // API
    const organization = await OrganizationAPI.add({ name: values.name })

    // Local
    organization.name = values.name
    swr.addOneOrganization(organization)
  } catch (err: any) {
    ErrorNotification(errors.add, err)
    throw err
  }
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add = ({ swr }: IProps): JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Autofocus
  useEffect(() => {
    /* istanbul ignore next */
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
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: { name: string }): Promise<void> => {
      setLoading(true)
      try {
        await _onAdd(values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err) {
        setLoading(false)
        throw err
      }
    },
    [swr]
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
