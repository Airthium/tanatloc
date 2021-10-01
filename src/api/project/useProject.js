import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use project
 * @memberof API.Project
 * @param {string} id Project's id
 * @returns {Array} [project, { mutateProject, errorProject, loadingProject }]
 */
const useProject = (id) => {
  const { data, error, mutate } = useSWR(
    '/api/project' + (id ? '/' + id : ''),
    Caller.fetcher
  )
  const loading = !data
  const project = data?.project || {}

  const myMutate = (update) => {
    mutate({
      project: {
        ...project,
        ...update
      }
    })
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

export default useProject
