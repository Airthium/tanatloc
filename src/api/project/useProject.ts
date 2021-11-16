import useSWR from 'swr'
import { fetcher } from '@/api/call'
import { IProjectWithData } from '@/lib/index.d'

/**
 * Use project
 * @memberof API.Project
 * @param {string} id Project id
 * @returns {Array} `[project, { mutateProject, errorProject, loadingProject }]`
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
  const project = data?.project || {}

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
