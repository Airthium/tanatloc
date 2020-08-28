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

  const addOne = (project) => {
    const newProjects = [...projects, project]
    mutate({ projects: newProjects })
  }

  const delOne = (project) => {
    const filteredProjects = projects.filter((p) => p.id !== project.id)
    mutate({ projects: filteredProjects })
  }

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
      loadingProjects: loading
    }
  ]
}

export default useProjects
