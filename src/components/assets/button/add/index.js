import PropTypes from 'prop-types'
import { Button } from 'antd'

/**
 * Add button
 * @memberof module:renderer/components/assets/button
 * @param {Object} props Props
 */
const AddButton = ({ disabled, loading, icon, onAdd, children }) => {
  /**
   * Render
   */
  return (
    <Button disabled={disabled} loading={loading} icon={icon} onClick={onAdd}>
      {children || 'Add'}
    </Button>
  )
}

AddButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  onAdd: PropTypes.func.isRequired,
  children: PropTypes.node
}

export default AddButton
