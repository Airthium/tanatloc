import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

/**
 * Add button
 * @memberof Components.Assets.Button
 * @param {Object} props Props
 */
const AddButton = ({ disabled, loading, children, onAdd }) => {
  /**
   * Render
   */
  return (
    <Tooltip title={children || 'Add'}>
      <Button
        disabled={disabled}
        loading={loading}
        icon={<PlusCircleOutlined />}
        onClick={onAdd}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

AddButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  onAdd: PropTypes.func.isRequired
}

export default AddButton
