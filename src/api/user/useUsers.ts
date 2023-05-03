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
    addOneUser: (user: IFrontNewUser) => Promise<void>
    delOneUser: (user: IFrontMutateUsersItem) => Promise<void>
    mutateOneUser: (user: IFrontMutateUsersItem) => Promise<void>
    errorUsers: Error
    loadingUsers: boolean
  }
] => {
  const defaultData: IFrontUsers = []

  const { data, error, mutate } = useSWR('/api/users', fetcher)
  const loading = !data
  const users = data?.users ?? defaultData

  /**
   * Add one
   * @param user User
   */
  const addOne = useCallback(
    async (user: IFrontNewUser): Promise<void> => {
      const newUsers = [
        ...users,
        { ...user, authorizedplugins: [] }
      ] as IFrontUsers
      await mutate({ users: newUsers })
    },
    [users, mutate]
  )

  /**
   * Del one
   * @param user User
   */
  const delOne = useCallback(
    async (user: IFrontMutateUsersItem): Promise<void> => {
      const filteredUsers = users.filter((u) => u.id !== user.id)
      await mutate({ users: filteredUsers })
    },
    [users, mutate]
  )

  /**
   * Mutate one
   * @param user User
   */
  const mutateOne = useCallback(
    async (user: IFrontMutateUsersItem): Promise<void> => {
      const mutatedUsers = users.map((u) => {
        if (u.id === user.id) u = { ...u, ...user }
        return u
      })
      await mutate({ users: mutatedUsers })
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
