/** @module Components.Workspace.Delete */

import { useCallback, useState } from 'react'

import { IFrontMutateWorkspacesItem, IFrontWorkspacesItem } from '@/api/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  workspace: Pick<IFrontWorkspacesItem, 'id'>
  swr: {
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
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
export const _onDelete = async (
  workspace: Pick<IFrontWorkspacesItem, 'id'>,
  swr: {
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  }
): Promise<void> => {
  try {
    // Delete
    await WorkspaceAPI.del({ id: workspace.id })

    // Mutate
    await swr.delOneWorkspace({ id: workspace.id })
  } catch (err: any) {
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
   * On delete
   */
  const onDelete = useCallback(async () => {
    setLoading(true)
    try {
      await _onDelete(workspace, swr)
    } finally {
      setLoading(false)
    }
  }, [workspace, swr])

  /**
   * Render
   */
  return (
    <DeleteButton
      bordered
      loading={loading}
      text="The projects contained in this workspace will be lost."
      onDelete={onDelete}
    />
  )
}

export default Delete
