/** @module API.System.UseSystem */

import useSWR from 'swr'

import { ISystem } from '@/database/index.d'

import { fetcher } from '@/api/call'

/**
 * Use system
 * @returns System
 */
export const useSystem = (): [
  ISystem,
  {
    mutateSystem: (system: ISystem) => void
    errorSystem: Error
    loadingSystem: boolean
  }
] => {
  const { data, error, mutate } = useSWR('/api/system', fetcher)
  const loading = !data
  const system = data?.system

  /**
   * Mutate
   * @param update System
   */
  const localMutate = (update: ISystem): void => {
    mutate({
      system: {
        ...system,
        ...update
      }
    })
  }

  return [
    system,
    { mutateSystem: localMutate, errorSystem: error, loadingSystem: loading }
  ]
}
