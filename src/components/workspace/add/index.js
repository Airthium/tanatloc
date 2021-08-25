import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form, Input } from 'antd'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

/**
 * Errors add
 * @memberof module:components/workspace
 */
const errors = {
  add: 'Unable to add the workspace'
}

/**
 * Add workspace
 * @memberof module:components/workspace
 * @param {Object} props Props
 */
const Add = ({ visible, swr, setVisible }) => {
  // Sate
  const [loading, setLoading] = useState(false)

  /**
   * On confirm
   * @param {Object} values Values
   */
  const onOk = async (values) => {
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
    }
  }

  /**
   * Render
   */
  return (
    <Dialog
      title="Create a new workspace"
      visible={visible}
      onCancel={() => setVisible(false)}
      onOk={onOk}
      confirmLoading={loading}
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
