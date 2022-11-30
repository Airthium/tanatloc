/** @module Components.Project.Add */

import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'

import { LIMIT } from '@/config/string'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import {
  IFrontMutateWorkspacesItem,
  IFrontNewProject,
  IFrontWorkspacesItem
} from '@/api/index.d'
import ProjectAPI from '@/api/project'

import { globalStyleFn } from '@/styles'

/**
 * Props
 */
export interface IProps {
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'projects'>
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
    addOneProject: (project: IFrontNewProject) => void
  }
}

/**
 * Errors
 */
export const errors = {
  add: 'Unable to add project'
}

/**
 * On add
 * @param workspace Workspace
 * @param values Values
 * @param swr SWR
 */
export const onAdd = async (
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'projects'>,
  values: Pick<IFrontNewProject, 'title' | 'description'>,
  swr: {
    addOneProject: (project: IFrontNewProject) => void
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
  }
): Promise<IFrontNewProject> => {
  try {
    // Add
    const project = await ProjectAPI.add({ id: workspace.id }, values)

    // Mutate projects
    swr.addOneProject(project)

    // Mutate workspaces
    swr.mutateOneWorkspace({
      ...workspace,
      projects: [...workspace.projects, project.id]
    })

    return project
  } catch (err) {
    ErrorNotification(errors.add, err)
    throw err
  }
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add = ({ workspace, swr }: IProps): JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Data
  const router = useRouter()

  // Autofocus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Render
   */
  return (
    <>
      <AddButton primary={false} dark onAdd={() => setVisible(true)}>
        Create a new project
      </AddButton>
      <Dialog
        title="Create a new project"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={async (values) => {
          setLoading(true)
          try {
            const newProject = await onAdd(workspace, values, swr)

            // Close
            setLoading(false)
            setVisible(false)

            // Open project
            router.push({
              pathname: '/project',
              query: {
                page: 'workspaces',
                workspaceId: workspace.id,
                projectId: newProject.id
              }
            })
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
        loading={loading}
      >
        <Form.Item
          label="Name"
          name="title"
          rules={[
            { required: true, message: 'Name is required' },
            {
              max: LIMIT,
              message: 'Max ' + LIMIT + ' characters'
            }
          ]}
        >
          <Input ref={inputRef} placeholder="Project's name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            showCount
            css={globalStyleFn.marginBottom(20)}
            maxLength={120}
            placeholder="Project's description"
            onKeyUp={(event) => event.stopPropagation()}
          />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Add
