/** @module API.Project.UseProject */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IFrontMutateProject, IFrontProject } from '@/api/index.d'

import { fetcher } from '@/api/call'

// Default data
export type DefaultData = { id: '0' }

/**
 * Use project
 * @param id Project id
 * @returns Project
 */
export const useProject = (
  id?: string
): [
  IFrontProject | DefaultData,
  {
    mutateProject: (project: IFrontMutateProject) => Promise<void>
    errorProject: Error
    loadingProject: boolean
  }
] => {
  const defaultData = { id: '0' } as IFrontProject

  const { data, error, mutate } = useSWR(
    '/api/project' + (id ? '/' + id : ''),
    fetcher
  )
  const loading = !data
  const project = data?.project ?? defaultData

  /**
   * Mutate
   * @param update Project
   */
  const localMutate = useCallback(
    async (update: IFrontMutateProject): Promise<void> => {
      const mutatedProject = {
        ...project,
        ...update
      }
      await mutate({ project: mutatedProject })
    },
    [project, mutate]
  )

  return [
    project,
    {
      mutateProject: localMutate,
      errorProject: error,
      loadingProject: loading
    }
  ]
}
