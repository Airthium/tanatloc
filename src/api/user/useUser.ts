/** @module API.User.UseUser */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IFrontMutateUser, IFrontUser } from '../index.d'

import { fetcher } from '@/api/call'

/**
 * Use user
 * @returns User
 */
export const useUser = (): [
  IFrontUser | undefined,
  {
    mutateUser: (user: IFrontMutateUser) => void
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
    (update: IFrontMutateUser): void => {
      mutate({
        user: {
          ...(user as IFrontUser),
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
