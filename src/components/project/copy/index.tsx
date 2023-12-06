/** @module Components.Project.Copy */

import { ReactNode, useCallback, useContext } from 'react'
import { Button, Tooltip } from 'antd'
import { CopyOutlined } from '@ant-design/icons'

import {
  IFrontMutateWorkspacesItem,
  IFrontNewProject,
  IFrontProjectsItem,
  IFrontWorkspacesItem
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import ProjectAPI from '@/api/project'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export type Workspace = Pick<IFrontWorkspacesItem, 'id' | 'projects'>
export type Project = Pick<IFrontProjectsItem, 'id'>
export type Swr = {
  addOneProject: (project: IFrontNewProject) => Promise<void>
  mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
}
export interface IProps {
  workspace: Workspace
  project: Project
  swr: Swr
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
  workspace: Workspace,
  project: Project,
  swr: Swr
): Promise<void> => {
  // Copy
  const newProject = await ProjectAPI.copy(workspace, project)

  // Mutate projects
  await swr.addOneProject(newProject)

  // Mutate workspaces
  workspace.projects.push(newProject.id)
  await swr.mutateOneWorkspace(workspace)
}

/**
 * Copy
 * @param props Props
 * @returns Copy
 */
const Copy = ({ workspace, project, swr }: IProps): ReactNode => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On copy
   */
  const onCopy = useCallback((): void => {
    const asyncFunction = async () => {
      try {
        await _onCopy(workspace, project, swr)
      } catch (err: any) {
        dispatch(addError({ title: errors.copy, err }))
      }
    }
    asyncFunction().catch(console.error)
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
