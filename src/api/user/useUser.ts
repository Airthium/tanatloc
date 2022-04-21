/** @module API.User.UseUser */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IUserWithData } from '@/lib/index.d'

import { fetcher } from '@/api/call'

/**
 * Use user
 * @returns User
 */
export const useUser = (): [
  IUserWithData<any> | undefined,
  {
    mutateUser: (user: Partial<IUserWithData<any>>) => void
    clearUser: () => void
    errorUser: Error
    loadingUser: boolean
  }
] => {
  const { data, error, mutate } = useSWR('/api/user', fetcher)
  const loading = !data
  const user = data?.user

  /**
   * Mutate
   * @param update User
   */
  const localMutate = useCallback(
    (update: Partial<IUserWithData<any>>): void => {
      mutate({
        user: {
          ...user,
          ...update
        }
      })
    },
    [user, mutate]
  )

  const clear = useCallback(() => {
    mutate({ user: undefined })
  }, [mutate])

  return [
    user,
    {
      mutateUser: localMutate,
      clearUser: clear,
      errorUser: error?.status === 401 ? undefined : error,
      loadingUser: error?.status === 401 ? false : loading
    }
  ]
}
