/** @module Components.Project.Add */

import {
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { useRouter } from 'next/router'
import { Form, Input, InputRef } from 'antd'

import {
  IFrontMutateWorkspacesItem,
  IFrontNewProject,
  IFrontWorkspacesItem
} from '@/api/index.d'

import { LIMIT120, LIMIT50 } from '@/config/string'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { AddButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'

import ProjectAPI from '@/api/project'

/**
 * Props
 */
export type Workspace = Pick<IFrontWorkspacesItem, 'id' | 'projects'>
export type Values = Pick<IFrontNewProject, 'title' | 'description'>
export type Swr = {
  mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  addOneProject: (project: IFrontNewProject) => Promise<void>
}
export interface IProps {
  workspace: Workspace
  swr: Swr
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
export const _onAdd = async (
  workspace: Workspace,
  values: Values,
  swr: Swr
): Promise<IFrontNewProject> => {
  // Add
  const project = await ProjectAPI.add({ id: workspace.id }, values)

  // Mutate projects
  await swr.addOneProject(project)

  // Mutate workspaces
  await swr.mutateOneWorkspace({
    ...workspace,
    projects: [...workspace.projects, project.id]
  })

  return project
}

/**
 * Add
 * @param props Props
 * @returns Add
 */
const Add: React.FunctionComponent<IProps> = ({ workspace, swr }) => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const router = useRouter()

  // Autofocus
  useEffect(() => {
    /* istanbul ignore next */
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => setVisible(false), [])

  /**
   * On key up
   * @param event Event
   */
  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>): void =>
      event.stopPropagation(),
    []
  )

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: Values): Promise<void> => {
      setLoading(true)
      try {
        const newProject = await _onAdd(workspace, values, swr)

        // Close
        setLoading(false)
        setVisible(false)

        // Open project
        await router.push({
          pathname: '/project',
          query: {
            page: 'workspaces',
            workspaceId: workspace.id,
            projectId: newProject.id
          }
        })
      } catch (err: any) {
        dispatch(addError({ title: errors.add, err }))
        setLoading(false)
        throw err
      }
    },
    [router, workspace, swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <AddButton primary={false} dark onAdd={setVisibleTrue}>
        Create a new project
      </AddButton>
      <Dialog
        title="Create a new project"
        visible={visible}
        onCancel={setVisibleFalse}
        onOk={onOk}
        loading={loading}
      >
        <Form.Item
          label="Name"
          name="title"
          rules={[
            { required: true, message: 'Name is required' },
            {
              max: LIMIT50,
              message: 'Max ' + LIMIT50 + ' characters'
            }
          ]}
        >
          <Input ref={inputRef} placeholder="Project's name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            showCount
            style={{ marginBottom: '20px' }}
            maxLength={LIMIT120}
            placeholder="Project's description"
            onKeyUp={onKeyUp}
          />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Add
