import PropTypes from 'prop-types'
import { Button, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'

export interface IProps {
  disabled?: boolean
  primary?: boolean
  bordered?: boolean
  light?: boolean
  dark?: boolean
  needMargin?: boolean
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
 * - primary (boolean) Set Button type
 * - light (boolean) Set Button text to light
 * - dark (boolean) Set Button text to dark
 * - needMargin (boolean) Set Button left margin to 5px
 * - loading (boolean) Set loading state
 * - children (React node) Button children
 * - onEdit (Function) Button click
 */
const EditButton = ({
  disabled,
  primary = false,
  bordered,
  light,
  dark,
  needMargin,
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
        className={
          (needMargin ? 'marginLeft-5' : '') +
          (light ? ' text-light' : '') +
          (dark ? ' text-dark' : '')
        }
        disabled={disabled}
        loading={loading}
        type={primary ? 'primary' : 'default'}
        icon={<EditOutlined />}
        style={{ backgroundColor: 'none', border: !bordered && 'none' }}
        onClick={onEdit}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

EditButton.propTypes = {
  disabled: PropTypes.bool,
  primary: PropTypes.bool,
  light: PropTypes.bool,
  dark: PropTypes.bool,
  needMargin: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  onEdit: PropTypes.func.isRequired
}

export default EditButton
