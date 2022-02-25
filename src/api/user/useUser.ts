/** @module API.User.UseUser */

import useSWR from 'swr'

import { IUserWithData } from '@/lib/index.d'

import { fetcher } from '@/api/call'

/**
 * Use user
 * @returns User
 */
export const useUser = (): [
  IUserWithData,
  {
    mutateUser: (user: IUserWithData) => void
    clearUser: () => void
    errorUser: Error
    loadingUser: boolean
  }
] => {
  const { data, error, mutate } = useSWR('/api/user', fetcher)
  const loading = !data
  const user = data?.user

  const myMutate = (update: IUserWithData) => {
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
