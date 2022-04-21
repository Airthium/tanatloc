/** @module API.System.UseSystem */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IFrontSystem } from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use system
 * @returns System
 */
export const useSystem = (): [
  IFrontSystem | undefined,
  {
    mutateSystem: (system: Partial<IFrontSystem>) => void
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
    (update: Partial<IFrontSystem>): void => {
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
