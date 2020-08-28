import useSWR from 'swr'
import { fetcher } from '../call'

/**
 * Use a workspace (SWR)
 * @memberof module:src/api/workspace
 * @returns {Array} [workspaces, {mutateWorkspaces function, loadingWorkspaces status}]
 */
const useWorkspaces = () => {
  const { data, mutate } = useSWR('/api/workspace', fetcher)
  const loading = !data
  const workspaces = (data && data.workspaces) || []

  const addOne = (workspace) => {
    const newWorkspaces = [...workspaces, workspace]
    mutate({ workspaces: newWorkspaces })
  }

  const delOne = (workspace) => {
    const filteredWorkspaces = workspaces.filter((w) => w.id !== workspace.id)
    mutate({ workspace: filteredWorkspaces })
  }

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
      loadingWorkspaces: loading
    }
  ]
}

export default useWorkspaces
