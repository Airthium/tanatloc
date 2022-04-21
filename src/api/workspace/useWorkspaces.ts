/** @module API.Workspace.UseWorkspaces */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IFrontWorkspaces, IFrontWorkspacesItem } from '@/api/index.d'
import { fetcher } from '@/api/call'

// TODO new workspace ?

/**
 * Use workspace (SWR)
 * @returns Workspaces
 */
export const useWorkspaces = (): [
  IFrontWorkspaces,
  {
    addOneWorkspace: (workspace: Partial<IFrontWorkspacesItem>) => void
    delOneWorkspace: (workspace: Partial<IFrontWorkspacesItem>) => void
    mutateOneWorkspace: (workspace: Partial<IFrontWorkspacesItem>) => void
    errorWorkspaces: Error
    loadingWorkspaces: boolean
  }
] => {
  const defaultData: IFrontWorkspaces = []

  const { data, error, mutate } = useSWR('/api/workspace', fetcher)
  const loading = !data
  const workspaces = data?.workspaces || defaultData

  /**
   * Add one (useWorkspaces)
   * @param workspace Workspace
   */
  const addOne = useCallback(
    (workspace: Partial<IFrontWorkspacesItem>): void => {
      const newWorkspaces = [...workspaces, workspace] as IFrontWorkspaces
      mutate({ workspaces: newWorkspaces })
    },
    [workspaces, mutate]
  )

  /**
   * Delete one (useWorkspaces)
   * @param workspace Workspace
   */
  const delOne = useCallback(
    (workspace: Partial<IFrontWorkspacesItem>): void => {
      const filteredWorkspaces = workspaces.filter((w) => w.id !== workspace.id)
      mutate({ workspaces: filteredWorkspaces })
    },
    [workspaces, mutate]
  )

  /**
   * Mutate one (useWorkspace)
   * @param workspace Workspace
   */
  const mutateOne = useCallback(
    (workspace: Partial<IFrontWorkspacesItem>): void => {
      const mutatedWorkspaces = workspaces.map((w) => {
        if (w.id === workspace.id) w = { ...w, ...workspace }
        return w
      })
      mutate({ workspaces: mutatedWorkspaces })
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
