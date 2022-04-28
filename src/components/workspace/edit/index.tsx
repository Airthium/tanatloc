/** @module Components.Workspace.Edit */

import { useState } from 'react'
import { Form, Input } from 'antd'

import { LIMIT } from '@/config/string'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import { IFrontMutateWorkspacesItem, IFrontWorkspacesItem } from '@/api/index.d'
import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'name'>
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update the workspace'
}

/**
 * On edit
 * @param workspace Workspace
 * @param values Values
 * @param swr SWR
 */
export const onEdit = async (
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'name'>,
  values: Pick<IFrontWorkspacesItem, 'name'>,
  swr: { mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void }
): Promise<void> => {
  try {
    // New workspace
    const newWorkspace = Utils.deepCopy(workspace)
    workspace.name = values.name

    // Edit
    await WorkspaceAPI.update({ id: workspace.id }, [
      { key: 'name', value: values.name }
    ])

    // Mutate
    swr.mutateOneWorkspace(newWorkspace)
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
const Edit = ({ workspace, swr }: IProps): JSX.Element => {
  // Sate
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <>
      <EditButton bordered dark onEdit={() => setVisible(true)} />
      <Dialog
        visible={visible}
        loading={loading}
        title="Edit a workspace"
        initialValues={{ name: workspace.name }}
        onCancel={() => setVisible(false)}
        onOk={async (values) => {
          setLoading(true)
          try {
            await onEdit(workspace, values, swr)

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

export default Edit
