import useSWR from 'swr'
import Caller from '@/api/call'

/**
 * Use projects
 * @memberof module:api/project
 * @param {Array} ids [Project's ids]
 */
const useProjects = (ids) => {
  const { data, error, mutate } = useSWR(
    '/api/projects' + (ids && ids.length ? '/' + ids.join('&') : ''),
    Caller.fetcher
  )
  const loading = !data
  const projects = (data && data.projects) || []

  /**
   * Add one (useProjects)
   * @memberof module:api/project
   * @param {Object} project Project
   */
  const addOne = (project) => {
    const newProjects = [...projects, project]
    mutate({ projects: newProjects })
  }

  /**
   * Delete one (useProjects)
   * @memberof module:api/project
   * @param {Object} project project
   */
  const delOne = (project) => {
    const filteredProjects = projects.filter((p) => p.id !== project.id)
    mutate({ projects: filteredProjects })
  }

  /**
   * Mutate one (useProjects)
   * @memberof module:api/project
   * @param {Object} project Project
   */
  const mutateOne = (project) => {
    const mutatedProjects = projects.map((p) => {
      if (p.id === project.id) p = { ...p, ...project }
      return p
    })
    mutate({ projects: mutatedProjects })
  }

  return [
    projects,
    {
      mutateProjects: mutate,
      addOneProject: addOne,
      delOneProject: delOne,
      mutateOneProject: mutateOne,
      errorProjects: error,
      loadingProjects: loading
    }
  ]
}

export default useProjects
