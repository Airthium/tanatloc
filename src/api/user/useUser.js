import useSWR from 'swr'
import { fetcher } from '../call'

export default () => {
  const { data, mutate } = useSWR('/api/user', fetcher)
  const loading = !data
  const user = data && data.user
  return [user, { mutateUser: mutate, loadingUser: loading }]
}
