import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import { Error } from '@/components/assets/notification'
import Dialog from '@/components/assets/dialog'

import WorkspaceAPI from '@/api/workspace'

const errors = {
  addError: 'Unable to add the workspace'
}

/**
 * Add workspace
 * @memberof module:components/workspace
 * @param {Object} props Props
 */
const Add = ({ swr }) => {
  // Sate
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)

  /**
   * Toggle dialog
   */
  const toggleDialog = () => {
    setVisible(!visible)
  }

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

      toggleDialog()
    } catch (err) {
      Error(errors.addError, err)
    } finally {
      setLoading(false)
    }
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    toggleDialog()
  }

  /**
   * Render
   */
  return (
    <>
      <Button onClick={toggleDialog} icon={<PlusCircleOutlined />}>
        Create a new workspace
      </Button>
      <Dialog
        title="Create a new workspace"
        closable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={onOk}
        confirmLoading={loading}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            { required: true, message: "Please enter a workspace's name" }
          ]}
        >
          <Input placeholder="Workspace's name" />
        </Form.Item>
      </Dialog>
    </>
  )
}

Add.propTypes = {
  swr: PropTypes.object.isRequired
}

export default Add
