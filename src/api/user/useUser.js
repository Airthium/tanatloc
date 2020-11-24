import useSWR from 'swr'
import Caller from '../call'

/**
 * Use a user
 * @memberof module:src/api/user
 * @returns {Array} [user, {mutateUser function, loadingUser status}]]
 */
const useUser = () => {
  const { data, mutate } = useSWR('/api/user', Caller.fetcher)
  const loading = !data
  const user = data && data.user
  return [user, { mutateUser: mutate, loadingUser: loading }]
}

export default useUser
