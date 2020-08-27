import useSWR from 'swr'
import { fetcher } from '../call'

/**
 * Use projects
 * @memberof module:src/api/project
 * @param {Array} ids [Project's ids]
 */
const useProjects = (ids) => {
  const { data, mutate } = useSWR(
    '/api/projects/' + (ids && ids.join('&')),
    fetcher
  )
  const loading = !data
  const projects = (data && data.projects) || []
  return [projects, { mutateProjects: mutate, loadingProjects: loading }]
}

export default useProjects
