import useSWR from 'swr'
import { fetcher } from '@/api/call'
import { IWorkspaceWithData } from '@/lib'

/**
 * Use workspace (SWR)
 * @memberof API.Workspace
 * @returns {Array} `[workspaces, {mutateWorkspaces, addOneWorkspace, delOneWorkspace, mutateOneWorkspace, errorWorkspaces, loadingWorkspaces}]`
 */
export const useWorkspaces = (): [
  IWorkspaceWithData,
  {
    mutateWorkspaces: Function
    addOneWorkspace: Function
    delOneWorkspace: Function
    mutateOneWorkspace: Function
    errorWorkspaces: Error
    loadingWorkspaces: boolean
  }
] => {
  const { data, error, mutate } = useSWR('/api/workspace', fetcher)
  const loading = !data
  const workspaces = data?.workspaces || []

  /**
   * Add one (useWorkspaces)
   * @memberof API.Workspace
   * @param {Object} workspace Workspace
   */
  const addOne = (workspace) => {
    const newWorkspaces = [...workspaces, workspace]
    mutate({ workspaces: newWorkspaces })
  }

  /**
   * Delete one (useWorkspaces)
   * @memberof API.Workspace
   * @param {Object} workspace Workspace
   */
  const delOne = (workspace) => {
    const filteredWorkspaces = workspaces.filter((w) => w.id !== workspace.id)
    mutate({ workspace: filteredWorkspaces })
  }

  /**
   * Mutate one (useWorkspace)
   * @memberof API.Workspace
   * @param {Object} workspace Workspace
   */
  const mutateOne = (workspace) => {
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
