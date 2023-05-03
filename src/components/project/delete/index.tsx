/** @module Components.Project.Delete */

import { useCallback, useState } from 'react'
import { Alert, Typography } from 'antd'

import {
  IFrontMutateProjectsItem,
  IFrontMutateWorkspacesItem,
  IFrontProjectsItem,
  IFrontWorkspacesItem
} from '@/api/index.d'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'projects'>
  project: Pick<IFrontProjectsItem, 'id' | 'title'>
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
    delOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
  }
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
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'projects'>,
  project: Pick<IFrontProjectsItem, 'id' | 'title'>,
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
    delOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
  }
): Promise<void> => {
  try {
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
  } catch (err: any) {
    ErrorNotification(errors.del, err)
    throw err
  }
}

/**
 * Delete
 * @param props Props
 * @returns Delete
 */
const Delete = ({ disabled, workspace, project, swr }: IProps): JSX.Element => {
  // Sate
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * On delete
   */
  const onDelete = useCallback(async () => {
    setLoading(true)
    try {
      await _onDelete(workspace, project, swr)
    } finally {
      setLoading(false)
    }
  }, [workspace, project, swr])

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
