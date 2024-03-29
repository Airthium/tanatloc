/** @module API.Project.UseProjects */

import useSWR from 'swr'
import { useCallback } from 'react'

import {
  IFrontMutateProjectsItem,
  IFrontNewProject,
  IFrontProjects
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
    addOneProject: (project: IFrontNewProject) => Promise<void>
    delOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
    mutateOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
    errorProjects: Error
    loadingProjects: boolean
  }
] => {
  const defaultData: IFrontProjects = []

  const { data, error, mutate } = useSWR(
    ['/api/projects', JSON.stringify({ ids })],
    ([url, payload]) => fetcher(url, payload)
  )
  const loading = !data
  const projects = data?.projects ?? defaultData

  /**
   * Add one (useProjects)
   * @param project Project
   */
  const addOne = useCallback(
    async (project: IFrontNewProject): Promise<void> => {
      const newProjects = [
        ...projects,
        { ...project, users: [], geometries: [], simulations: [], groups: [] }
      ] as IFrontProjects
      await mutate({ projects: newProjects })
    },
    [projects, mutate]
  )

  /**
   * Delete one (useProjects)
   * @param project project
   */
  const delOne = useCallback(
    async (project: IFrontMutateProjectsItem): Promise<void> => {
      const filteredProjects = projects.filter((p) => p.id !== project.id)
      await mutate({ projects: filteredProjects })
    },
    [projects, mutate]
  )

  /**
   * Mutate one (useProjects)
   * @param project Project
   */
  const mutateOne = useCallback(
    async (project: IFrontMutateProjectsItem): Promise<void> => {
      const mutatedProjects = projects.map((p) => {
        if (p.id === project.id) p = { ...p, ...project }
        return p
      })
      await mutate({ projects: mutatedProjects })
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
