import { useState } from 'react'
import { message, Button, Modal, Space } from 'antd'
import { DeleteOutlined, ExclamationCircleTwoTone } from '@ant-design/icons'

import { del } from '../../../../src/api/workspace'

/**
 * Delete workspace
 * @memberof module:renderer/components/workspace
 * @param {Object} props Props
 */
const Delete = (props) => {
  const id = props.id

  const [visible, setVisible] = useState(false)

  /**
   * Toggle confirm delete
   */
  const toggleConfirm = () => {
    setVisible(!visible)
  }

  /**
   * Handle delete
   */
  const handleDelete = () => {
    del({ id }).catch((err) => {
      message.error(err.message)
    })
    toggleConfirm()
  }

  /**
   * Render
   */
  return (
    <>
      <Button onClick={toggleConfirm} icon={<DeleteOutlined />}>
        Delete
      </Button>
      <Modal
        className="WorkspaceDelete-confirm"
        okText={'Delete'}
        closable={false}
        onOk={handleDelete}
        onCancel={toggleConfirm}
        visible={visible}
      >
        <Space size="middle">
          <ExclamationCircleTwoTone
            twoToneColor="#faad14"
            style={{ fontSize: '1.5em' }}
          />
          The projects contained in this workspace will be lost.
        </Space>
      </Modal>
    </>
  )
}

export default Delete
