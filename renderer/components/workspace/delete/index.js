import { message, Button, Popconfirm } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import deleteWorkspace from '../../../../src/api/workspace/delete'

const DeletePage = (props) => {
  const id = props.id

  const handleDelete = () => {
    deleteWorkspace({ id }).catch((err) => {
      message.error(err.message)
    })
  }

  return (
    <>
      <Popconfirm
        title="Are you sure delete this workspace?"
        icon={<DeleteOutlined />}
        onConfirm={handleDelete}
      >
        <Button danger icon={<DeleteOutlined />}>
          Delete it
        </Button>
      </Popconfirm>
    </>
  )
}

export default DeletePage
