import useSWR from 'swr'

import { fetcher } from '@/api/call'

import { ISystem } from '@/database/index.d'

/**
 * Use system
 * @memberof API.System
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

  const myMutate = (update: ISystem) => {
    mutate({
      system: {
        ...system,
        ...update
      }
    })
  }

  return [
    system,
    { mutateSystem: myMutate, errorSystem: error, loadingSystem: loading }
  ]
}
