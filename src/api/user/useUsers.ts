/** @module API.User.UseUsers */

import useSWR from 'swr'

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
  const { data, error, mutate } = useSWR('/api/users', fetcher)
  const loading = !data
  const users = data?.users || []

  /**
   * Add one
   * @param user User
   */
  const addOne = (user: IUserWithData): void => {
    const newUsers = [...users, user]
    mutate({ users: newUsers })
  }

  /**
   * Del one
   * @param user User
   */
  const delOne = (user: IUserWithData): void => {
    const filteredUsers = users.filter((u) => u.id !== user.id)
    mutate({ users: filteredUsers })
  }

  /**
   * Mutate one
   * @param user User
   */
  const mutateOne = (user: IUserWithData): void => {
    const mutatedUsers = users.map((u) => {
      if (u.id === user.id) u = { ...u, ...user }
      return u
    })
    mutate({ users: mutatedUsers })
  }

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
