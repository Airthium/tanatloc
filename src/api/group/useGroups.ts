/** @module API.Group.UseGroups */

import useSWR from 'swr'

import { IGroupWithData } from '@/lib/index.d'

import { fetcher } from '@/api/call'

/**
 * Use groups
 * @param id Id
 * @returns Groups
 */
export const useGroups = (
  id?: string
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
   * @param group Group
   */
  const addOne = (group: IGroupWithData): void => {
    const newGroups = [...groups, group]
    mutate({ groups: newGroups })
  }

  /**
   * Del one
   * @param group Group
   */
  const delOne = (group: IGroupWithData): void => {
    const filteredGroups = groups.filter((g) => g.id !== group.id)
    mutate({ groups: filteredGroups })
  }

  /**
   * Mutate one
   * @param groups Group
   */
  const mutateOne = (group: IGroupWithData): void => {
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
