/** @module Components.Workspace.Edit */

import {
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Form, Input, InputRef } from 'antd'

import { LIMIT50 } from '@/config/string'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'

import Utils from '@/lib/utils'

import { IFrontMutateWorkspacesItem, IFrontWorkspacesItem } from '@/api/index.d'
import WorkspaceAPI from '@/api/workspace'

/**
 * Props
 */
export interface IProps {
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'name'>
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  update: 'Unable to update workspace'
}

/**
 * On edit
 * @param workspace Workspace
 * @param values Values
 * @param swr SWR
 */
export const _onEdit = async (
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'name'>,
  values: Pick<IFrontWorkspacesItem, 'name'>,
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  }
): Promise<void> => {
  // New workspace
  const newWorkspace = Utils.deepCopy(workspace)
  workspace.name = values.name

  // Edit
  await WorkspaceAPI.update({ id: workspace.id }, [
    { key: 'name', value: values.name }
  ])

  // Mutate
  await swr.mutateOneWorkspace(newWorkspace)
}

/**
 * Edit
 * @param props Props
 * @returns Edit
 */
const Edit = ({ workspace, swr }: IProps): ReactNode => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // Sate
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Context
  const { dispatch } = useContext(NotificationContext)

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
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: Pick<IFrontWorkspacesItem, 'name'>): Promise<void> => {
      setLoading(true)
      try {
        await _onEdit(workspace, values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err: any) {
        dispatch(addError({ title: errors.update, err }))
        setLoading(false)
        throw err
      }
    },
    [workspace, swr, dispatch]
  )

  /**
   * Render
   */
  return (
    <>
      <EditButton bordered dark onEdit={setVisibleTrue} />
      <Dialog
        visible={visible}
        loading={loading}
        title="Edit the workspace"
        initialValues={{ name: workspace.name }}
        onCancel={setVisibleFalse}
        onOk={onOk}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Name is required' },
            {
              max: LIMIT50,
              message: 'Max ' + LIMIT50 + ' characters'
            }
          ]}
        >
          <Input ref={inputRef} placeholder="Workspace's name" />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Edit
