import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'

export interface IProps {
  disabled?: boolean
  loading?: boolean
  children?: string
  onEdit: () => void
}

/**
 * Edit button
 * @memberof Components.Assets.Button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - children (React node) Button children
 * - onEdit (Function) Button click
 */
const EditButton = ({
  disabled,
  loading,
  children,
  onEdit
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Tooltip title={children || 'Edit'}>
      <Button
        disabled={disabled}
        loading={loading}
        icon={<EditOutlined />}
        style={{ backgroundColor: 'none', border: 'none' }}
        onClick={onEdit}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

EditButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  onEdit: PropTypes.func.isRequired
}

export default EditButton
