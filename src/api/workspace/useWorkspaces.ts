/** @module API.Workspace.UseWorkspaces */

import useSWR from 'swr'
import { useCallback } from 'react'

import {
  IFrontMutateWorkspacesItem,
  IFrontNewWorkspace,
  IFrontWorkspaces
} from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use workspace (SWR)
 * @returns Workspaces
 */
export const useWorkspaces = (): [
  IFrontWorkspaces,
  {
    addOneWorkspace: (workspace: IFrontNewWorkspace) => Promise<void>
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
    errorWorkspaces: Error
    loadingWorkspaces: boolean
  }
] => {
  const defaultData: IFrontWorkspaces = []

  const { data, error, mutate } = useSWR('/api/workspace', fetcher)
  const loading = !data
  const workspaces = data?.workspaces ?? defaultData

  /**
   * Add one (useWorkspaces)
   * @param workspace Workspace
   */
  const addOne = useCallback(
    async (workspace: IFrontNewWorkspace): Promise<void> => {
      const newWorkspaces = [...workspaces, workspace] as IFrontWorkspaces
      await mutate({ workspaces: newWorkspaces })
    },
    [workspaces, mutate]
  )

  /**
   * Delete one (useWorkspaces)
   * @param workspace Workspace
   */
  const delOne = useCallback(
    async (workspace: IFrontMutateWorkspacesItem): Promise<void> => {
      const filteredWorkspaces = workspaces.filter((w) => w.id !== workspace.id)
      await mutate({ workspaces: filteredWorkspaces })
    },
    [workspaces, mutate]
  )

  /**
   * Mutate one (useWorkspace)
   * @param workspace Workspace
   */
  const mutateOne = useCallback(
    async (workspace: IFrontMutateWorkspacesItem): Promise<void> => {
      const mutatedWorkspaces = workspaces.map((w) => {
        if (w.id === workspace.id) w = { ...w, ...workspace }
        return w
      })
      await mutate({ workspaces: mutatedWorkspaces })
    },
    [workspaces, mutate]
  )

  return [
    workspaces,
    {
      addOneWorkspace: addOne,
      delOneWorkspace: delOne,
      mutateOneWorkspace: mutateOne,
      errorWorkspaces: error,
      loadingWorkspaces: loading
    }
  ]
}
