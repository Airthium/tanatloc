import useSWR from 'swr'
import { fetcher } from '@/api/call'
import { IProjectWithData } from '@/lib/index.d'

/**
 * Use projects
 * @memberof API.Project
 * @param ids Projects ids
 * @returns {Array} `[projects, { mutateProjects, addOneProject, delOneProject, mutateOneProject, errorProjects, loadingProjects }]`
 */
export const useProjects = (
  ids: string[]
): [
  IProjectWithData[],
  {
    mutateProjects: (data: { projects: IProjectWithData[] }) => void
    addOneProject: (project: IProjectWithData) => void
    delOneProject: (project: IProjectWithData) => void
    mutateOneProject: (project: IProjectWithData) => void
    errorProjects: Error
    loadingProjects: boolean
  }
] => {
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
  const addOne = (project: IProjectWithData) => {
    const newProjects = [...projects, project]
    mutate({ projects: newProjects })
  }

  /**
   * Delete one (useProjects)
   * @memberof API.Project
   * @param {Object} project project
   */
  const delOne = (project: IProjectWithData) => {
    const filteredProjects = projects.filter((p) => p.id !== project.id)
    mutate({ projects: filteredProjects })
  }

  /**
   * Mutate one (useProjects)
   * @memberof API.Project
   * @param {Object} project Project
   */
  const mutateOne = (project: IProjectWithData) => {
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
