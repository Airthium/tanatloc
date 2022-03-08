/** @module Components.Workspace.Add */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Form, Input } from 'antd'

import { INewWorkspace } from '@/database/index.d'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  swr: {
    addOneWorkspace: (workspace: INewWorkspace) => void
  }
}

/**
 * Errors
 */
const errors = {
  add: 'Unable to add the workspace'
}

/**
 * On confirm
 * @param values Values
 * @param swr SWR
 */
export const onOk = async (
  values: { name: string },
  swr: { addOneWorkspace: (workspace: INewWorkspace) => void }
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
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

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

Add.propTypes = {
  swr: PropTypes.exact({
    addOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Add
