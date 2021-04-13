import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use a user
 * @memberof module:api/user
 * @returns {Array} [user, {mutateUser function, loadingUser status}]]
 */
const useUser = () => {
  const { data, error, mutate } = useSWR('/api/user', Caller.fetcher)
  const loading = !data
  const user = data && data.user
  return [user, { mutateUser: mutate, errorUser: error, loadingUser: loading }]
}

export default useUser
