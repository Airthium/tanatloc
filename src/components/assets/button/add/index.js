import PropTypes from 'prop-types'
import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

/**
 * Add button
 * @memberof module:components/assets/button
 * @param {Object} props Props
 */
const AddButton = ({ disabled, loading, children, onAdd }) => {
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
      {children}
    </Button>
  )
}

AddButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  onAdd: PropTypes.func.isRequired
}

export default AddButton
