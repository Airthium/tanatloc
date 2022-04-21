/** @module API.Group.UseGroups */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IFrontNewGroup, IFrontGroups, IFrontGroupsItem } from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use groups
 * @param id Id
 * @returns Groups
 */
export const useGroups = (
  id?: string
): [
  IFrontGroups,
  {
    addOneGroup: (group: IFrontNewGroup) => void
    delOneGroup: (group: Partial<IFrontGroupsItem>) => void
    mutateOneGroup: (group: Partial<IFrontGroupsItem>) => void
    errorGroups: Error
    loadingGroups: boolean
  }
] => {
  const defaultData: IFrontGroups = []

  const { data, error, mutate } = useSWR('/api/groups/' + id, fetcher)
  const loading = !data
  const groups = data?.groups || defaultData

  /**
   * Add one
   * @param group Group
   */
  const addOne = useCallback(
    (group: IFrontNewGroup): void => {
      const newGroups = [...groups, group] as IFrontGroups
      mutate({ groups: newGroups })
    },
    [groups, mutate]
  )

  /**
   * Del one
   * @param group Group
   */
  const delOne = useCallback(
    (group: Partial<IFrontGroupsItem>): void => {
      const filteredGroups = groups.filter((g) => g.id !== group.id)
      mutate({ groups: filteredGroups })
    },
    [groups, mutate]
  )

  /**
   * Mutate one
   * @param groups Group
   */
  const mutateOne = useCallback(
    (group: Partial<IFrontGroupsItem>): void => {
      const mutatedGroups = groups.map((g) => {
        if (g.id === group.id) g = { ...g, ...group }
        return g
      })
      mutate({ groups: mutatedGroups })
    },
    [groups, mutate]
  )

  return [
    groups,
    {
      addOneGroup: addOne,
      delOneGroup: delOne,
      mutateOneGroup: mutateOne,
      errorGroups: error,
      loadingGroups: loading
    }
  ]
}
