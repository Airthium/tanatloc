import PropTypes from 'prop-types'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

/**
 * Add button
 * @memberof module:components/assets/button
 * @param {Object} props Props
 */
const AddButton = ({ disabled, loading, onAdd, children }) => {
  /**
   * Render
   */
  return (
    <Button
      disabled={disabled}
      loading={loading}
      icon={<PlusCircleOutlined />}
      onClick={onAdd}
    >
      {children || 'Add'}
    </Button>
  )
}

AddButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onAdd: PropTypes.func.isRequired,
  children: PropTypes.node
}

export default AddButton
