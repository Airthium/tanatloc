import { message, Button, Modal } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

import { del } from '../../../../src/api/workspace'

const DeletePage = (props) => {
  const id = props.id

  const showDeleteConfirm = () => {
    return Modal.confirm({
      className: 'Workspace-delete',
      title: 'Delete this workspace?',
      icon: <ExclamationCircleOutlined />,
      content: 'The projects contained in this workspace will be lost.',
      okText: 'Delete',
      autoFocusButton: 'null',
      maskClosable: 'true',
      cancelText: 'Cancel',
      onOk: handleDelete
    })
  }

  const handleDelete = () => {
    del({ id }).catch((err) => {
      message.error(err.message)
    })
  }

  return (
    <Button onClick={showDeleteConfirm} icon={<DeleteOutlined />}>
      Delete
    </Button>
  )
}

export default DeletePage
