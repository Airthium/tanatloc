/** @module Components.Workspace.Delete */

import { useState } from 'react'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import { IFrontMutateWorkspacesItem, IFrontWorkspacesItem } from '@/api/index.d'
import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  workspace: Pick<IFrontWorkspacesItem, 'id'>
  swr: {
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete workspace'
}

/**
 * On delete
 * @param workspace Workspace
 * @param swr SWR
 */
export const onDelete = async (
  workspace: Pick<IFrontWorkspacesItem, 'id'>,
  swr: { delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void }
): Promise<void> => {
  try {
    // Delete
    await WorkspaceAPI.del({ id: workspace.id })

    // Mutate
    swr.delOneWorkspace({ id: workspace.id })
  } catch (err) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Delete workspace
 * @param props Props
 * @returns Delete
 */
const Delete = ({ workspace, swr }: IProps): JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <DeleteButton
      bordered
      loading={loading}
      text="The projects contained in this workspace will be lost."
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(workspace, swr)
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}

export default Delete
