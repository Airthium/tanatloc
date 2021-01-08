import PropTypes from 'prop-types'
import { Button } from 'antd'

/**
 * Add button
 * @memberof module:renderer/components/assets/button
 * @param {Object} props Props
 */
const AddButton = ({ loading, disabled, onAdd }) => {
  /**
   * Render
   */
  return (
    <Button disabled={disabled} loading={loading} onClick={onAdd}>
      Add
    </Button>
  )
}

AddButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool.isRequired,
  onAdd: PropTypes.func.isRequired
}

export default AddButton
