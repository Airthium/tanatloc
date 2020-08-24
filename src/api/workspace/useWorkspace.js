import useSWR from 'swr'
import { fetcher } from '../call'

/**
 * Use a workspace (SWR)
 * @memberof module:src/api/workspace
 * @returns {Array} [workspace, {mutate function, loading status}]
 */
const useWorkspace = () => {
  const { data, mutate } = useSWR('/api/workspace', fetcher)
  const loading = !data
  const workspaces = data && data.workspaces
  return [workspaces, { mutateWorkspace: mutate, loadingWorkspace: loading }]
}

export default useWorkspace
