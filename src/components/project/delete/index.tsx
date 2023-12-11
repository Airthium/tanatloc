/** @module Components.Project.Delete */

import { useCallback, useContext, useState } from 'react'
import { Alert, Typography } from 'antd'

import {
  IFrontMutateProjectsItem,
  IFrontMutateWorkspacesItem,
  IFrontProjectsItem,
  IFrontWorkspacesItem
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { DeleteButton } from '@/components/assets/button'

import ProjectAPI from '@/api/project'

/**
 * Props
 */
export type Workspace = Pick<IFrontWorkspacesItem, 'id' | 'projects'>
export type Project = Pick<IFrontProjectsItem, 'id' | 'title'>
export type Swr = {
  mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  delOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
}
export interface IProps {
  disabled?: boolean
  workspace: Workspace
  project: Project
  swr: Swr
}

/**
 * Errors
 */
export const errors = {
  del: 'Unable to delete project'
}

/**
 * On delete
 * @param workspace Workspace
 * @param project Project
 * @param swr SWR
 */
export const _onDelete = async (
  workspace: Workspace,
  project: Project,
  swr: Swr
): Promise<void> => {
  // Delete
  await ProjectAPI.del({ id: workspace.id }, { id: project.id })

  // Mutate workspaces
  const index = workspace.projects.findIndex((p) => p === project.id)
  workspace.projects = [
    ...workspace.projects.slice(0, index),
    ...workspace.projects.slice(index + 1)
  ]
  await swr.mutateOneWorkspace(workspace)

  // Mutate projects
  await swr.delOneProject({ id: project.id })
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete: React.FunctionComponent<IProps> = ({
  disabled,
  workspace,
  project,
  swr
}) => {
  // Sate
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On delete
   */
  const onDelete = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      await _onDelete(workspace, project, swr)
    } catch (err: any) {
      dispatch(addError({ title: errors.del, err }))
      throw err
    } finally {
      setLoading(false)
    }
  }, [workspace, project, swr, dispatch])

  /**
   * Render
   */
  return (
    <DeleteButton
      disabled={disabled}
      loading={loading}
      title="Delete the project"
      text={
        <>
          Are you sure you want to delete the project{' '}
          <Typography.Text strong>{project.title}</Typography.Text>?
          <Alert
            type="error"
            message="If you delete the project, you will no longer be able to restore the archive"
            style={{ marginTop: '16px' }}
          />
        </>
      }
      onDelete={onDelete}
    />
  )
}

export default Delete
