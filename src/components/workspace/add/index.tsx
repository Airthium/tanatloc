/** @module Components.Workspace.Add */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'

import { IFrontNewWorkspace } from '@/api/index.d'

import { LIMIT } from '@/config/string'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  swr: {
    addOneWorkspace: (workspace: IFrontNewWorkspace) => void
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
  swr: { addOneWorkspace: (workspace: IFrontNewWorkspace) => void }
): Promise<void> => {
  try {
    // Add
    const workspace = await WorkspaceAPI.add(values)

    // Mutate
    swr.addOneWorkspace(workspace)
  } catch (err) {
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

  // Sate
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

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
              max: LIMIT,
              message: 'Max ' + LIMIT + ' characters'
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
