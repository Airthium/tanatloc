/** @module Components.Workspace.Add */

import { useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'

import { IFrontNewWorkspace } from '@/api/index.d'

import { LIMIT50 } from '@/config/string'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'

import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  swr: {
    addOneWorkspace: (workspace: IFrontNewWorkspace) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  add: 'Unable to add workspace'
}

/**
 * On confirm
 * @param values Values
 * @param swr SWR
 */
export const _onAdd = async (
  values: Pick<IFrontNewWorkspace, 'name'>,
  swr: { addOneWorkspace: (workspace: IFrontNewWorkspace) => Promise<void> }
): Promise<void> => {
  // Add
  const workspace = await WorkspaceAPI.add(values)

  // Mutate
  await swr.addOneWorkspace(workspace)
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add: React.FunctionComponent<IProps> = ({ swr }) => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // Sate
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

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
    async (values: Pick<IFrontNewWorkspace, 'name'>): Promise<void> => {
      setLoading(true)
      try {
        await _onAdd(values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err: any) {
        dispatch(addError({ title: errors.add, err }))
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
      <AddButton onAdd={setVisibleTrue}>Create a new workspace</AddButton>
      <Dialog
        visible={visible}
        loading={loading}
        title="Create a new workspace"
        onCancel={setVisibleFalse}
        onOk={onOk}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Name is required' },
            {
              max: LIMIT50,
              message: 'Max ' + LIMIT50 + ' characters'
            }
          ]}
        >
          <Input ref={inputRef} placeholder="Workspace's name" />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Add
