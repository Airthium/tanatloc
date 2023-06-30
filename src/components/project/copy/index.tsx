/** @module Components.Project.Copy */

import { Dispatch, useCallback, useContext } from 'react'
import { Button, Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import {
  IFrontMutateWorkspacesItem,
  IFrontNewProject,
  IFrontProjectsItem,
  IFrontWorkspacesItem
} from '@/api/index.d'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import ProjectAPI from '@/api/project'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'projects'>
  project: Pick<IFrontProjectsItem, 'id'>
  swr: {
    addOneProject: (project: IFrontNewProject) => Promise<void>
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  copy: 'Unable to copy project'
}

/**
 * On copy
 * @param workspace Workspace
 * @param project Project
 * @param swr SWR
 */
export const _onCopy = async (
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'projects'>,
  project: Pick<IFrontProjectsItem, 'id'>,
  swr: {
    addOneProject: (project: IFrontNewProject) => Promise<void>
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    // Copy
    const newProject = await ProjectAPI.copy(workspace, project)

    // Mutate projects
    await swr.addOneProject(newProject)

    // Mutate workspaces
    workspace.projects.push(newProject.id)
    await swr.mutateOneWorkspace(workspace)
  } catch (err: any) {
    dispatch(addError({ title: errors.copy, err }))
  }
}

/**
 * Copy
 * @param props Props
 * @returns Copy
 */
const Copy = ({ workspace, project, swr }: IProps): React.JSX.Element => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On copy
   */
  const onCopy = useCallback((): void => {
    ;(async () => {
      await _onCopy(workspace, project, swr, dispatch)
    })()
  }, [workspace, project, swr, dispatch])

  /**
   * Render
   */
  return (
    <Tooltip title="Copy">
      <Button
        icon={<CopyOutlined />}
        className={`${globalStyle.noBorder} ${globalStyle.noBackground}`}
        onClick={onCopy}
      />
    </Tooltip>
  )
}

export default Copy
