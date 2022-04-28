/** @module API.System.UseSystem */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IFrontMutateSystem, IFrontSystem } from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use system
 * @returns System
 */
export const useSystem = (): [
  IFrontSystem,
  {
    mutateSystem: (system: IFrontMutateSystem) => void
    errorSystem: Error
    loadingSystem: boolean
  }
] => {
  const defaultData = {} as IFrontSystem

  const { data, error, mutate } = useSWR('/api/system', fetcher)
  const loading = !data
  const system = data?.system || defaultData

  /**
   * Mutate
   * @param update System
   */
  const localMutate = useCallback(
    (update: IFrontMutateSystem): void => {
      mutate({
        system: {
          ...(system as IFrontSystem),
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
