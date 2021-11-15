import useSWR from 'swr'
import { fetcher } from '@/api/call'

/**
 * Use projects
 * @memberof API.Project
 * @param {Array} ids [Projects ids]
 * @returns {Array} `[projects, { mutateProjects, addOneProject, delOneProject, mutateOneProject, errorProjects, loadingProjects }]`
 */
const useProjects = (ids) => {
  const { data, error, mutate } = useSWR(
    ['/api/projects', JSON.stringify({ ids })],
    fetcher
  )
  const loading = !data
  const projects = data?.projects || []

  /**
   * Add one (useProjects)
   * @memberof API.Project
   * @param {Object} project Project
   */
  const addOne = (project) => {
    const newProjects = [...projects, project]
    mutate({ projects: newProjects })
  }

  /**
   * Delete one (useProjects)
   * @memberof API.Project
   * @param {Object} project project
   */
  const delOne = (project) => {
    const filteredProjects = projects.filter((p) => p.id !== project.id)
    mutate({ projects: filteredProjects })
  }

  /**
   * Mutate one (useProjects)
   * @memberof API.Project
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
