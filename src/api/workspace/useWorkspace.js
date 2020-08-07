import useSWR from 'swr'
import { fetcher } from '../call'

export default () => {
  const { data, mutate } = useSWR('/api/workspace', fetcher)
  const loading = !data
  const workspaces = data && data.workspaces
  return [workspaces, { mutateWorkspace: mutate, loadingWorkspace: loading }]
}
