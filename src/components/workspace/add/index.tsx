import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form, Input } from 'antd'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

interface IProps {
  visible: boolean
  swr: {
    addOneWorkspace: Function
  }
  setVisible: Function
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
const Add = ({ visible, swr, setVisible }: IProps): JSX.Element => {
  // Sate
  const [loading, setLoading]: [boolean, Function] = useState(false)

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
        rules={[{ required: true, message: "Please enter a workspace's name" }]}
      >
        <Input placeholder="Workspace's name" />
      </Form.Item>
    </Dialog>
  )
}

Add.propTypes = {
  visible: PropTypes.bool.isRequired,
  swr: PropTypes.shape({
    addOneWorkspace: PropTypes.func.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired
}

export default Add
