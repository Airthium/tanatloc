import useSWR from 'swr'

import { fetcher } from '@/api/call'

import { IGroupWithData } from '@/lib'

/**
 * Use groups
 * @memberof API.Group
 * @param {string} id Id
 * @returns {Object} `[ groups, { mutateGroups, addOneGroup, delOneGroup, mutateOneGroup, errorGroups, loadingGroups }]`
 */
export const useGroups = (
  id: string
): [
  IGroupWithData[],
  {
    mutateGroups: (data: { groups: IGroupWithData[] }) => void
    addOneGroup: (group: IGroupWithData) => void
    delOneGroup: (group: IGroupWithData) => void
    mutateOneGroup: (group: IGroupWithData) => void
    errorGroups: Error
    loadingGroups: boolean
  }
] => {
  const { data, error, mutate } = useSWR('/api/groups/' + id, fetcher)
  const loading = !data
  const groups = data?.groups || []

  /**
   * Add one
   * @param {Object} group Group
   */
  const addOne = (group: IGroupWithData) => {
    const newGroups = [...groups, group]
    mutate({ groups: newGroups })
  }

  /**
   * Del one
   * @param {Object} group Group
   */
  const delOne = (group: IGroupWithData) => {
    const filteredGroups = groups.filter((g) => g.id !== group.id)
    mutate({ groups: filteredGroups })
  }

  /**
   * Mutate one
   * @param {Object} groups Group
   */
  const mutateOne = (group: IGroupWithData) => {
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
