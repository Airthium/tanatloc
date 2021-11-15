import useSWR from 'swr'
import { fetcher } from '@/api/call'

/**
 * Use user
 * @memberof API.User
 * @returns {Array} `[user, { mutateUser, clearUser, errorUser, loadingUser }]]`
 */
const useUser = () => {
  const { data, error, mutate } = useSWR('/api/user', fetcher)
  const loading = !data
  const user = data?.user

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
