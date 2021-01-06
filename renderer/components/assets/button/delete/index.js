import PropTypes from 'prop-types'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'

const DeleteButton = ({ loading, onDelete }) => {
  /**
   * Render
   */
  return (
    <Popconfirm
      title="Are you sure?"
      icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
      onConfirm={onDelete}
    >
      <Button type="danger" loading={loading} icon={<DeleteOutlined />} />
    </Popconfirm>
  )
}

DeleteButton.propTypes = {
  loading: PropTypes.bool.isRequired,
  onDelete: PropTypes.func.isRequired
}

export default DeleteButton
