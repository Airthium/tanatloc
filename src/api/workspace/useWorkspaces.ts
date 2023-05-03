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
    addOneWorkspace: (workspace: IFrontNewWorkspace) => void
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
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
    (workspace: IFrontNewWorkspace): void => {
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
    (workspace: IFrontMutateWorkspacesItem): void => {
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
    (workspace: IFrontMutateWorkspacesItem): void => {
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
