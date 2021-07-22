import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use groups
 * @param {string} id Id
 * @memberof module:api/group
 */
const useGroups = (id) => {
  const { data, error, mutate } = useSWR('/api/groups/' + id, Caller.fetcher)
  const loading = !data
  const groups = (data && data.groups) || []

  /**
   * Add one
   * @param {Object} group Group
   */
  const addOne = (group) => {
    const newGroups = [...groups, group]
    mutate({ groups: newGroups })
  }

  /**
   * Del one
   * @param {Object} group Group
   */
  const delOne = (group) => {
    const filteredGroups = groups.filter((g) => g.id !== group.id)
    mutate({ groups: filteredGroups })
  }

  /**
   * Mutate one
   * @param {Object} groups Group
   */
  const mutateOne = (group) => {
    const mutatedGroups = groups.map((g) => {
      if (g.id === group.id) g = { ...g, ...group }
      return g
    })
    mutate({ groups: mutatedGroups })
  }

  return [
    groups,
    {
      mutateGroups: mutate,
      addOneGroup: addOne,
      delOneGroup: delOne,
      mutateOneGroup: mutateOne,
      errorGroups: error,
      loadingGroups: loading
    }
  ]
}

export default useGroups
