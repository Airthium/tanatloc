/** @module API.User.UseUsers */

import useSWR from 'swr'
import { useCallback } from 'react'

import {
  IFrontMutateUsersItem,
  IFrontNewUser,
  IFrontUsers
} from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use users
 * @returns Users
 */
export const useUsers = (): [
  IFrontUsers,
  {
    addOneUser: (user: IFrontNewUser) => void
    delOneUser: (user: IFrontMutateUsersItem) => void
    mutateOneUser: (user: IFrontMutateUsersItem) => void
    errorUsers: Error
    loadingUsers: boolean
  }
] => {
  const defaultData: IFrontUsers = []

  const { data, error, mutate } = useSWR('/api/users', fetcher)
  const loading = !data
  const users = data?.users || defaultData

  /**
   * Add one
   * @param user User
   */
  const addOne = useCallback(
    (user: IFrontNewUser): void => {
      const newUsers = [...users, user] as IFrontUsers
      mutate({ users: newUsers })
    },
    [users, mutate]
  )

  /**
   * Del one
   * @param user User
   */
  const delOne = useCallback(
    (user: IFrontMutateUsersItem): void => {
      const filteredUsers = users.filter((u) => u.id !== user.id)
      mutate({ users: filteredUsers })
    },
    [users, mutate]
  )

  /**
   * Mutate one
   * @param user User
   */
  const mutateOne = useCallback(
    (user: IFrontMutateUsersItem): void => {
      const mutatedUsers = users.map((u) => {
        if (u.id === user.id) u = { ...u, ...user }
        return u
      })
      mutate({ users: mutatedUsers })
    },
    [users, mutate]
  )

  return [
    users,
    {
      addOneUser: addOne,
      delOneUser: delOne,
      mutateOneUser: mutateOne,
      errorUsers: error,
      loadingUsers: loading
    }
  ]
}
