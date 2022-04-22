/** @module Components.Workspace.Add */

import { useState } from 'react'
import { Form, Input } from 'antd'

import { LIMIT } from '@/config/string'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import { IFrontNewWorkspace } from '@/api/index.d'
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
  add: 'Unable to add the workspace'
}

/**
 * On confirm
 * @param values Values
 * @param swr SWR
 */
export const onOk = async (
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
  // Sate
  const [loading, setLoading] = useState<boolean>(false)
  const [visible, setVisible] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <>
      <AddButton onAdd={() => setVisible(true)}>
        Create a new workspace
      </AddButton>
      <Dialog
        visible={visible}
        loading={loading}
        title="Create a new workspace"
        onCancel={() => setVisible(false)}
        onOk={async (values) => {
          setLoading(true)
          try {
            await onOk(values, swr)

            // Close
            setLoading(false)
            setVisible(false)
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
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
          <Input placeholder="Workspace's name" />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Add
