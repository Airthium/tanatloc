import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

export interface IProps {
  workspace: {
    id: string
    name?: string
  }
  swr: {
    mutateOneWorkspace: Function
  }
}

/**
 * Errors (edit)
 * @memberof Components.Workspace
 */
const errors = {
  update: 'Unable to update the workspace'
}

/**
 * Edit workspace
 * @memberof Components.Workspace
 * @param props Props
 */
const Edit = ({ workspace, swr }: IProps): JSX.Element => {
  // Sate
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On edit
   * @param values Values
   */
  const onEdit = async (values: { name: string }): Promise<void> => {
    setLoading(true)
    try {
      // New workspace
      const newWorkspace = { ...workspace }
      workspace.name = values.name

      // Edit
      await WorkspaceAPI.update({ id: workspace.id }, [
        { key: 'name', value: values.name }
      ])

      // Mutate
      swr.mutateOneWorkspace(newWorkspace)

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.update, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Button onClick={() => setVisible(true)} icon={<EditOutlined />} />
      <Dialog
        visible={visible}
        loading={loading}
        title="Edit a workspace"
        initialValues={{ name: workspace.name }}
        onCancel={() => setVisible(false)}
        onOk={onEdit}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "A Workspace name is required" }
          ]}
        >
          <Input placeholder="Workspace's name" />
        </Form.Item>
      </Dialog>
    </>
  )
}

Edit.propTypes = {
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string
  }).isRequired,
  swr: PropTypes.shape({
    mutateOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Edit
