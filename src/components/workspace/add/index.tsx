import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form, Input } from 'antd'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'
import { AddButton } from '@/components/assets/button'

import WorkspaceAPI from '@/api/workspace'

export interface IProps {
  swr: {
    addOneWorkspace: Function
  }
}

/**
 * Errors (add)
 * @memberof Components.Workspace
 */
const errors = {
  add: 'Unable to add the workspace'
}

/**
 * Add workspace
 * @memberof Components.Workspace
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
      Error(errors.add, err)
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
            { required: true, message: 'A Workspace name is required' },
            {
              max: 50,
              message: 'A workspace name must not exceed 50 characters'
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
