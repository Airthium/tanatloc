/** @module Components.Workspace.Add */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form, Input } from 'antd'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

import WorkspaceAPI from '@/api/workspace'

export interface IProps {
  swr: {
    addOneWorkspace: Function
  }
}

/**
 * Errors (add)
 */
const errors = {
  add: 'Unable to add the workspace'
}

/**
 * Add workspace
 * @param props Props
 */
const Add = ({ swr }: IProps): JSX.Element => {
  // Sate
  const [loading, setLoading]: [boolean, Function] = useState(false)
  const [visible, setVisible]: [boolean, Function] = useState(false)

  /**
   * On confirm
   * @param values Values
   */
  const onOk = async (values: { name: string }): Promise<void> => {
    setLoading(true)
    try {
      // Add
      const workspace = await WorkspaceAPI.add(values)

      // Mutate
      swr.addOneWorkspace(workspace)

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.add, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <>
      <AddButton onAdd={() => setVisible(true)}>
        Create a new workspace
      </AddButton>
      <Dialog
        visible={visible}
        loading={loading}
        title="Create a new workspace"
        onCancel={() => setVisible(false)}
        onOk={onOk}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: 'Name is required' },
            {
              max: 50,
              message: 'Max 50 characters'
            }
          ]}
        >
          <Input placeholder="Workspace's name" />
        </Form.Item>
      </Dialog>
    </>
  )
}

Add.propTypes = {
  swr: PropTypes.shape({
    addOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Add
