/** @module Components.Project.Edit */

import { KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'

import { LIMIT } from '@/config/string'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

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
  }
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
    ErrorNotification(errors.edit, err)

    throw err
  }
}

/**
 * Edit project
 * @param props Props
 * @returns Edit
 */
const Edit = ({ disabled, project, swr }: IProps): JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

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
        await _onEdit(project, values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err) {
        setLoading(false)
        throw err
      }
    },
    [project, swr]
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
              max: LIMIT,
              message: 'Max ' + LIMIT + ' characters'
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
            maxLength={120}
            onKeyUp={onKeyUp}
          />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Edit
