/** @module Components.Workspace.Edit */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Form, Input } from 'antd'

import { IWorkspaceWithData } from '@/lib/index.d'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'
import { EditButton } from '@/components/assets/button'

import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  workspace: IWorkspaceWithData
  swr: {
    mutateOneWorkspace: (workspace: IWorkspaceWithData) => void
  }
}

/**
 * Errors
 */
const errors = {
  update: 'Unable to update the workspace'
}

/**
 * On edit
 * @param workspace Workspace
 * @param values Values
 * @param swr SWR
 */
export const onEdit = async (
  workspace: IWorkspaceWithData,
  values: { name: string },
  swr: { mutateOneWorkspace: (workspace: IWorkspaceWithData) => void }
): Promise<void> => {
  try {
    // New workspace
    const newWorkspace = { ...workspace }
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
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

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
              max: 50,
              message: 'Max 50 characters'
            }
          ]}
        >
          <Input placeholder="Workspace's name" />
        </Form.Item>
      </Dialog>
    </>
  )
}

Edit.propTypes = {
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Edit
