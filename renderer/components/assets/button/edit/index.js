import PropTypes from 'prop-types'
import { Button } from 'antd'

/**
 * Edit button
 * @memberof module:renderer/components/assets/button
 * @param {Object} props Props
 */
const EditButton = ({ disabled, loading, icon, onEdit, children }) => {
  /**
   * Render
   */
  return (
    <Button disabled={disabled} loading={loading} icon={icon} onClick={onEdit}>
      {children || 'Edit'}
    </Button>
  )
}

EditButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  icon: PropTypes.node,
  onEdit: PropTypes.func.isRequired,
  children: PropTypes.node
}

export default EditButton
