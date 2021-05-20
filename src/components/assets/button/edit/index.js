import PropTypes from 'prop-types'
import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'

/**
 * Edit button
 * @memberof module:components/assets/button
 * @param {Object} props Props
 */
const EditButton = ({ disabled, loading, onEdit }) => {
  /**
   * Render
   */
  return (
    <Button
      disabled={disabled}
      loading={loading}
      icon={<EditOutlined style={{ color: '#fad114' }} />}
      style={{ backgroundColor: 'none', border: 'none' }}
      onClick={onEdit}
    />
  )
}

EditButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onEdit: PropTypes.func.isRequired
}

export default EditButton
