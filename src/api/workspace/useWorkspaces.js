import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use a workspace (SWR)
 * @memberof module:api/workspace
 * @returns {Array} [workspaces, {mutateWorkspaces function, loadingWorkspaces status}]
 */
const useWorkspaces = () => {
  const { data, error, mutate } = useSWR('/api/workspace', Caller.fetcher)
  const loading = !data
  const workspaces = (data && data.workspaces) || []

  /**
   * Add one (useWorkspaces)
   * @memberof module:api/workspace
   * @param {Object} workspace Workspace
   */
  const addOne = (workspace) => {
    const newWorkspaces = [...workspaces, workspace]
    mutate({ workspaces: newWorkspaces })
  }

  /**
   * Delete one (useWorkspaces)
   * @memberof module:api/workspace
   * @param {Object} workspace Workspace
   */
  const delOne = (workspace) => {
    const filteredWorkspaces = workspaces.filter((w) => w.id !== workspace.id)
    mutate({ workspace: filteredWorkspaces })
  }

  /**
   * Mutate one (useWorkspace)
   * @memberof module:api/workspace
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
      errorWorkspace: error,
      loadingWorkspaces: loading
    }
  ]
}

export default useWorkspaces
