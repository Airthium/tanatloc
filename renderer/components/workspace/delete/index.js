import { message, Button, Modal } from 'antd'
import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons'

const { confirm } = Modal;

import deleteWorkspace from '../../../../src/api/workspace/delete'

const DeletePage = (props) => {
  const id = props.id

  const showDeleteConfirm = () => {
    confirm({
      className: 'Workspace-delete',
      title: 'Delete this workspace?',
      icon: <ExclamationCircleOutlined />,
      content: 'The projects contained in this workspace will be lost.',
      okText: 'Delete',
      autoFocusButton: 'null',
      maskClosable: 'true',
      cancelText: 'Cancel',
      onOk() {
        handleDelete()
      },
      onCancel() {
        console.log('Cancel') // TODO
      },
    })
  }

  const handleDelete = () => {
    deleteWorkspace({ id }).catch((err) => {
      message.error(err.message)
    })
  }

  return (
    <>
      <Button onClick={showDeleteConfirm} icon={<DeleteOutlined />}>
        Delete
      </Button>
    </>
  )
}

export default DeletePage
