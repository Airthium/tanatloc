/** @module Components.Workspace.Delete */

import { Dispatch, useCallback, useContext, useState } from 'react'
import { useRouter } from 'next/router'

import { IFrontMutateWorkspacesItem, IFrontWorkspacesItem } from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DeleteButton } from '@/components/assets/button'

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
  },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    // Delete
    await WorkspaceAPI.del({ id: workspace.id })

    // Mutate
    await swr.delOneWorkspace({ id: workspace.id })
  } catch (err: any) {
    dispatch(addError({ title: errors.del, err }))
    throw err
  }
}

/**
 * Delete workspace
 * @param props Props
 * @returns Delete
 */
const Delete = ({ workspace, swr }: IProps): React.JSX.Element => {
  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const router = useRouter()

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(workspace, swr, dispatch)
      await router.push({
        pathname: '/dashboard',
        query: { page: 'workspaces' }
      })
    } finally {
      setLoading(false)
    }
  }, [router, workspace, swr, dispatch])

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
