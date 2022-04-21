/** @module API.User.UseUsers */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IUserWithData } from '@/lib/index.d'

import { fetcher } from '@/api/call'

/**
 * Use users
 * @returns Users
 */
export const useUsers = (): [
  IUserWithData[],
  {
    mutateUsers: (data: { users: IUserWithData[] }) => void
    addOneUser: (user: IUserWithData) => void
    delOneUser: (user: IUserWithData) => void
    mutateOneUser: (user: IUserWithData) => void
    errorUsers: Error
    loadingUsers: boolean
  }
] => {
  const defaultData: IUserWithData[] = []

  const { data, error, mutate } = useSWR('/api/users', fetcher)
  const loading = !data
  const users = data?.users || defaultData

  /**
   * Add one
   * @param user User
   */
  const addOne = useCallback(
    (user: IUserWithData): void => {
      const newUsers = [...users, user]
      mutate({ users: newUsers })
    },
    [users, mutate]
  )

  /**
   * Del one
   * @param user User
   */
  const delOne = useCallback(
    (user: IUserWithData): void => {
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
    (user: IUserWithData): void => {
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
      mutateUsers: mutate,
      addOneUser: addOne,
      delOneUser: delOne,
      mutateOneUser: mutateOne,
      errorUsers: error,
      loadingUsers: loading
    }
  ]
}
