import useSWR from 'swr'
import Caller from '../call'

/**
 * Use project
 * @memberof module:src/api/project
 * @param {string} id Project's id
 */
const useProject = (id) => {
  const { data, mutate } = useSWR(
    '/api/project' + (id ? '/' + id : ''),
    Caller.fetcher
  )
  const loading = !data
  const project = (data && data.project) || {}
  return [project, { mutateProject: mutate, loadingProject: loading }]
}

export default useProject
