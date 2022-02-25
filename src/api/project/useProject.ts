/** @module API.Project.UseProject */

import useSWR from 'swr'

import { IProjectWithData } from '@/lib/index.d'

import { fetcher } from '@/api/call'

/**
 * Use project
 * @param id Project id
 * @returns Project
 */
export const useProject = (
  id?: string
): [
  IProjectWithData,
  {
    mutateProject: (project: IProjectWithData) => void
    errorProject: Error
    loadingProject: boolean
  }
] => {
  const { data, error, mutate } = useSWR(
    '/api/project' + (id ? '/' + id : ''),
    fetcher
  )
  const loading = !data
  const project = data?.project || { id: '0' }

  /**
   * Mutate
   * @param update Project
   */
  const localMutate = (update: IProjectWithData): void => {
    const mutatedProject = {
      ...project,
      ...update
    }
    mutate({ project: mutatedProject })
  }

  return [
    project,
    {
      mutateProject: localMutate,
      errorProject: error,
      loadingProject: loading
    }
  ]
}
