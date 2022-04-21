/** @module API.Project.UseProjects */

import useSWR from 'swr'
import { useCallback } from 'react'

import {
  IFrontNewProject,
  IFrontProjects,
  IFrontProjectsItem
} from '@/api/index.d'
import { fetcher } from '@/api/call'

/**
 * Use projects
 * @param ids Projects ids
 * @returns Projects
 */
export const useProjects = (
  ids?: string[]
): [
  IFrontProjects,
  {
    addOneProject: (project: IFrontNewProject) => void
    delOneProject: (project: Partial<IFrontProjectsItem>) => void
    mutateOneProject: (project: Partial<IFrontProjectsItem>) => void
    errorProjects: Error
    loadingProjects: boolean
  }
] => {
  const defaultData: IFrontProjects = []

  const { data, error, mutate } = useSWR(
    ['/api/projects', JSON.stringify({ ids })],
    fetcher
  )
  const loading = !data
  const projects = data?.projects || defaultData

  /**
   * Add one (useProjects)
   * @param project Project
   */
  const addOne = useCallback(
    (project: IFrontNewProject): void => {
      const newProjects = [...projects, project] as IFrontProjects
      mutate({ projects: newProjects })
    },
    [projects, mutate]
  )

  /**
   * Delete one (useProjects)
   * @param project project
   */
  const delOne = useCallback(
    (project: Partial<IFrontProjectsItem>): void => {
      const filteredProjects = projects.filter((p) => p.id !== project.id)
      mutate({ projects: filteredProjects })
    },
    [projects, mutate]
  )

  /**
   * Mutate one (useProjects)
   * @param project Project
   */
  const mutateOne = useCallback(
    (project: Partial<IFrontProjectsItem>): void => {
      const mutatedProjects = projects.map((p) => {
        if (p.id === project.id) p = { ...p, ...project }
        return p
      })
      mutate({ projects: mutatedProjects })
    },
    [projects, mutate]
  )

  return [
    projects,
    {
      addOneProject: addOne,
      delOneProject: delOne,
      mutateOneProject: mutateOne,
      errorProjects: error,
      loadingProjects: loading
    }
  ]
}
