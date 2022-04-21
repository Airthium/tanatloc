/** @module API.System.UseSystem */

import useSWR from 'swr'
import { useCallback } from 'react'

import { ISystem } from '@/database/system'

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
  const localMutate = useCallback(
    (update: ISystem): void => {
      mutate({
        system: {
          ...system,
          ...update
        }
      })
    },
    [system, mutate]
  )

  return [
    system,
    { mutateSystem: localMutate, errorSystem: error, loadingSystem: loading }
  ]
}
