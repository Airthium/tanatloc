import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use users
 * @memberof module:api/user
 */
const useUsers = () => {
  const { data, error, mutate } = useSWR('/api/users', Caller.fetcher)
  const loading = !data
  const users = (data && data.users) || []

  /**
   * Add one
   * @param {Object} user User
   */
  const addOne = (user) => {
    const newUsers = [...users, user]
    mutate({ users: newUsers })
  }

  /**
   * Del one
   * @param {Object} user User
   */
  const delOne = (user) => {
    const filteredUsers = users.filter((u) => u.id !== user.id)
    mutate({ users: filteredUsers })
  }

  /**
   * Mutate one
   * @param {Object} user User
   */
  const mutateOne = (user) => {
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

export default useUsers
