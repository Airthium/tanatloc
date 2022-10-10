/** @module Components.Project.Delete */

import { useState } from 'react'
import { Alert, Typography } from 'antd'

import { DeleteButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import {
  IFrontMutateProjectsItem,
  IFrontMutateWorkspacesItem,
  IFrontProjectsItem,
  IFrontWorkspacesItem
} from '@/api/index.d'
import ProjectAPI from '@/api/project'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'projects'>
  project: Pick<IFrontProjectsItem, 'id' | 'title'>
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
    delOneProject: (project: IFrontMutateProjectsItem) => void
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
export const onDelete = async (
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'projects'>,
  project: Pick<IFrontProjectsItem, 'id' | 'title'>,
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
    delOneProject: (project: IFrontMutateProjectsItem) => void
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
    swr.mutateOneWorkspace(workspace)

    // Mutate projects
    swr.delOneProject({ id: project.id })
  } catch (err) {
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
      onDelete={async () => {
        setLoading(true)
        try {
          await onDelete(workspace, project, swr)
        } finally {
          setLoading(false)
        }
      }}
    />
  )
}

export default Delete
