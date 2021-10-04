import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import ProjectAPI from '@/api/project'

/**
 * Errors (edit)
 * @memberof Components.Project
 */
const errors = {
  editError: 'Unable to edit a project'
}

/**
 * Edit project
 * @memberof Components.Project
 * @param {Object} props Props
 */
const Edit = ({ disabled, project, swr }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * On edit
   * @param {Object} values Values
   */
  const onEdit = async (values) => {
    setLoading(true)
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

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.editError, err)
    } finally {
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button
        type="text"
        disabled={disabled}
        onClick={() => setVisible(true)}
        icon={<EditOutlined />}
      />
      <Dialog
        title={'Edit "' + project.title + '" project'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onEdit}
        loading={loading}
        initialValues={{
          title: project.title,
          description: project.description
        }}
      >
        <Form.Item
          label="Name"
          name="title"
          rules={[{ required: true, message: "Please enter a project's name" }]}
        >
          <Input placeholder="Project's name" />
        </Form.Item>
        <Form.Item label="Description" name="description">
          <Input.TextArea placeholder="Project's description" />
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
