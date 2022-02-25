/** @module API.Workspace.UseWorkspaces */

import useSWR from 'swr'

import { IWorkspaceWithData } from '@/lib/index.d'

import { fetcher } from '@/api/call'

/**
 * Use workspace (SWR)
 * @returns Workspaces
 */
export const useWorkspaces = (): [
  IWorkspaceWithData[],
  {
    mutateWorkspaces: (data: { workspaces: IWorkspaceWithData[] }) => void
    addOneWorkspace: (workspace: IWorkspaceWithData) => void
    delOneWorkspace: (workspace: IWorkspaceWithData) => void
    mutateOneWorkspace: (workspace: IWorkspaceWithData) => void
    errorWorkspaces: Error
    loadingWorkspaces: boolean
  }
] => {
  const { data, error, mutate } = useSWR('/api/workspace', fetcher)
  const loading = !data
  const workspaces = data?.workspaces || []

  /**
   * Add one (useWorkspaces)
   * @param workspace Workspace
   */
  const addOne = (workspace: IWorkspaceWithData): void => {
    const newWorkspaces = [...workspaces, workspace]
    mutate({ workspaces: newWorkspaces })
  }

  /**
   * Delete one (useWorkspaces)
   * @param workspace Workspace
   */
  const delOne = (workspace: IWorkspaceWithData): void => {
    const filteredWorkspaces = workspaces.filter((w) => w.id !== workspace.id)
    mutate({ workspaces: filteredWorkspaces })
  }

  /**
   * Mutate one (useWorkspace)
   * @param workspace Workspace
   */
  const mutateOne = (workspace: IWorkspaceWithData): void => {
    const mutatedWorkspaces = workspaces.map((w) => {
      if (w.id === workspace.id) w = { ...w, ...workspace }
      return w
    })
    mutate({ workspaces: mutatedWorkspaces })
  }

  return [
    workspaces,
    {
      mutateWorkspaces: mutate,
      addOneWorkspace: addOne,
      delOneWorkspace: delOne,
      mutateOneWorkspace: mutateOne,
      errorWorkspaces: error,
      loadingWorkspaces: loading
    }
  ]
}
