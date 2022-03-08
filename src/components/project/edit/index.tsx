/** @module Components.Project.Edit */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Form, Input } from 'antd'

import { IProjectWithData } from '@/lib/index.d'

import { EditButton } from '@/components/assets/button'
import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  project: IProjectWithData
  swr: {
    mutateOneProject: (project: IProjectWithData) => void
  }
}

/**
 * Errors
 */
export const errors = {
  edit: 'Unable to edit a project'
}

/**
 * On edit
 * @param project Project
 * @param values Values
 * @param swr SWR
 */
export const onEdit = async (
  project: IProjectWithData,
  values: {
    title: string
    description?: string
  },
  swr: { mutateOneProject: (project: IProjectWithData) => void }
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
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

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
              max: 50,
              message: 'Max 50 characters'
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

Edit.propTypes = {
  disabled: PropTypes.bool,
  project: PropTypes.exact({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string
  }).isRequired,
  swr: PropTypes.exact({
    mutateOneProject: PropTypes.func.isRequired
  }).isRequired
}

export default Edit
