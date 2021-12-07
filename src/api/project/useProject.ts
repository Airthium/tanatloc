import useSWR from 'swr'
import { fetcher } from '@/api/call'
import { IProjectWithData } from '@/lib/index.d'

/**
 * Use project
 * @memberof API.Project
 * @param id Project id
 * @returns Project
 */
export const useProject = (
  id: string
): [
  IProjectWithData,
  { mutateProject: Function; errorProject: Error; loadingProject: boolean }
] => {
  const { data, error, mutate } = useSWR(
    '/api/project' + (id ? '/' + id : ''),
    fetcher
  )
  const loading = !data
  const project = data?.project || { id: '0' }

  const myMutate = (update: IProjectWithData) => {
    const mutatedProject = {
      ...project,
      ...update
    }
    mutate({ project: mutatedProject })
  }

  return [
    project,
    {
      mutateProject: myMutate,
      errorProject: error,
      loadingProject: loading
    }
  ]
}