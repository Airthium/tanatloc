/** @module Components.Project.Edit */

import { useState } from 'react'
import { Form, Input } from 'antd'

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
    mutateOneProject: (project: IFrontMutateProjectsItem) => void
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
export const onEdit = async (
  project: Pick<IFrontProjectsItem, 'id'>,
  values: Pick<IFrontProjectsItem, 'title' | 'description'>,
  swr: { mutateOneProject: (project: IFrontMutateProjectsItem) => void }
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
    swr.mutateOneProject(project)
  } catch (err) {
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
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <>
      <EditButton disabled={disabled} dark onEdit={() => setVisible(true)} />
      <Dialog
        title={'Edit "' + project.title + '" project'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={async (values) => {
          setLoading(true)
          try {
            await onEdit(project, values, swr)

            // Close
            setLoading(false)
            setVisible(false)
          } catch (err) {
            setLoading(false)
            throw err
          }
        }}
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
          <Input placeholder="Project's name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea
            placeholder="Project's description"
            showCount
            maxLength={120}
          />
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Edit
