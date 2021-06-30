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

  const myMutate = (update) => {
    mutate({
      user: {
        ...user,
        ...update
      }
    })
  }

  const clear = () => {
    mutate({ user: null })
  }

  return [
    user,
    {
      mutateUser: myMutate,
      clearUser: clear,
      errorUser: error?.status === 401 ? undefined : error,
      loadingUser: error?.status === 401 ? false : loading
    }
  ]
}

export default useUser
