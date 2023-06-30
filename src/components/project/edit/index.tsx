/** @module Components.Project.Edit */

import {
  Dispatch,
  KeyboardEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { Form, Input, InputRef } from 'antd'

import { LIMIT120, LIMIT50 } from '@/config/string'

import {
  INotificationAction,
  NotificationContext
} from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'

import { IFrontMutateProjectsItem, IFrontProjectsItem } from '@/api/index.d'
import ProjectAPI from '@/api/project'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  project: Pick<IFrontProjectsItem, 'id' | 'title' | 'description'>
  swr: {
    mutateOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  edit: 'Unable to edit project'
}

/**
 * On edit
 * @param project Project
 * @param values Values
 * @param swr SWR
 */
export const _onEdit = async (
  project: Pick<IFrontProjectsItem, 'id'>,
  values: Pick<IFrontProjectsItem, 'title' | 'description'>,
  swr: {
    mutateOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
  },
  dispatch: Dispatch<INotificationAction>
): Promise<void> => {
  try {
    // Edit
    await ProjectAPI.update({ id: project.id }, [
      {
        key: 'title',
        value: values.title
      },
      {
        key: 'description',
        value: values.description
      }
    ])

    // Mutate projects
    await swr.mutateOneProject(project)
  } catch (err: any) {
    dispatch(addError({ title: errors.edit, err }))

    throw err
  }
}

/**
 * Edit project
 * @param props Props
 * @returns Edit
 */
const Edit = ({ disabled, project, swr }: IProps): React.JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
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
    async (
      values: Pick<IFrontProjectsItem, 'title' | 'description'>
    ): Promise<void> => {
      setLoading(true)
      try {
        await _onEdit(project, values, swr, dispatch)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err) {
        setLoading(false)
        throw err
      }
    },
    [project, swr, dispatch]
  )

  const onKeyUp = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>): void =>
      event.stopPropagation(),
    []
  )

  /**
   * Render
   */
  return (
    <>
      <EditButton disabled={disabled} dark onEdit={setVisibleTrue} />
      <Dialog
        title={'Edit "' + project.title + '" project'}
        visible={visible}
        onCancel={setVisibleFalse}
        onOk={onOk}
        loading={loading}
        initialValues={{
          title: project.title,
          description: project.description
        }}
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
            style={{ marginBottom: '20px' }}
            placeholder="Project's description"
            showCount
            maxLength={LIMIT120}
            onKeyUp={onKeyUp}
          />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Edit
