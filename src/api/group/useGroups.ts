/** @module API.Group.UseGroups */

import useSWR from 'swr'
import { useCallback } from 'react'

import {
  IFrontNewGroup,
  IFrontGroups,
  IFrontMutateGroupsItem
} from '@/api/index.d'
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
    addOneGroup: (group: IFrontNewGroup) => Promise<void>
    delOneGroup: (group: IFrontMutateGroupsItem) => Promise<void>
    mutateOneGroup: (group: IFrontMutateGroupsItem) => Promise<void>
    errorGroups: Error
    loadingGroups: boolean
  }
] => {
  const defaultData: IFrontGroups = []

  const { data, error, mutate } = useSWR('/api/groups/' + id, fetcher)
  const loading = !data
  const groups = data?.groups ?? defaultData

  /**
   * Add one
   * @param group Group
   */
  const addOne = useCallback(
    async (group: IFrontNewGroup): Promise<void> => {
      const newGroups = [...groups, group] as IFrontGroups
      await mutate({ groups: newGroups })
    },
    [groups, mutate]
  )

  /**
   * Del one
   * @param group Group
   */
  const delOne = useCallback(
    async (group: IFrontMutateGroupsItem): Promise<void> => {
      const filteredGroups = groups.filter((g) => g.id !== group.id)
      await mutate({ groups: filteredGroups })
    },
    [groups, mutate]
  )

  /**
   * Mutate one
   * @param groups Group
   */
  const mutateOne = useCallback(
    async (group: IFrontMutateGroupsItem): Promise<void> => {
      const mutatedGroups = groups.map((g) => {
        if (g.id === group.id) g = { ...g, ...group }
        return g
      })
      await mutate({ groups: mutatedGroups })
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
