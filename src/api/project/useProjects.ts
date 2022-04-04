/** @module API.Project.UseProjects */

import useSWR from 'swr'
import { useCallback } from 'react'

import { IProjectWithData } from '@/lib/index.d'
import { INewProject } from '@/database/index.d'

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
    addOneProject: (project: INewProject) => void
    delOneProject: (project: IProjectWithData) => void
    mutateOneProject: (project: IProjectWithData) => void
    errorProjects: Error
    loadingProjects: boolean
  }
] => {
  const defaultData = []

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
    (project: INewProject): void => {
      const newProjects = [...projects, project]
      //@ts-ignore
      mutate({ projects: newProjects })
    },
    [projects, mutate]
  )

  /**
   * Delete one (useProjects)
   * @param project project
   */
  const delOne = useCallback(
    (project: IProjectWithData): void => {
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
    (project: IProjectWithData): void => {
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
      mutateProjects: mutate,
      addOneProject: addOne,
      delOneProject: delOne,
      mutateOneProject: mutateOne,
      errorProjects: error,
      loadingProjects: loading
    }
  ]
}
