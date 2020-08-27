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
  return [workspaces, { mutateWorkspaces: mutate, loadingWorkspaces: loading }]
}

export default useWorkspaces
