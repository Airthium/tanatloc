/** @module API.Project.UseProjects */

import useSWR from 'swr'

import { IProjectWithData } from '@/lib/index.d'

import { fetcher } from '@/api/call'
/**
 * Use projects
 * @param ids Projects ids
 * @returns Projects
 */
export const useProjects = (
  ids?: string[]
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
   * @param project Project
   */
  const addOne = (project: IProjectWithData): void => {
    const newProjects = [...projects, project]
    mutate({ projects: newProjects })
  }

  /**
   * Delete one (useProjects)
   * @param project project
   */
  const delOne = (project: IProjectWithData): void => {
    const filteredProjects = projects.filter((p) => p.id !== project.id)
    mutate({ projects: filteredProjects })
  }

  /**
   * Mutate one (useProjects)
   * @param project Project
   */
  const mutateOne = (project: IProjectWithData): void => {
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
