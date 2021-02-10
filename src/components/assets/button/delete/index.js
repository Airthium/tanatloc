import PropTypes from 'prop-types'
import { Button, Popconfirm } from 'antd'
import { DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons'

/**
 * Delete button
 * @memberof module:@memberof module:'src/components/assets/button
 * @param {Object} props Props
 */
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
