import PropTypes from 'prop-types'
import { ReactChild } from 'react'
import { Button, Tooltip } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

export interface IProps {
  disabled?: boolean
  primary?: boolean
  light?: boolean
  dark?: boolean
  fullWidth?: boolean
  needMargin?: boolean
  loading?: boolean
  children?: ReactChild | ReactChild[]
  onAdd: Function
}

/**
 * Add button
 * @memberof Components.Assets.Button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - children (React child) Button children
 * - onAdd (Function) Button click
 */
const AddButton = ({
  disabled,
  primary = true,
  light,
  dark,
  fullWidth,
  needMargin,
  loading,
  children,
  onAdd
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Tooltip title={children || 'Add'}>
      <Button
        className={
          (fullWidth ? 'full-width' : '') +
          (needMargin ? ' marginLeft-buttonGroup' : '') +
          (light ? 'text-light' : '') +
          (dark ? ' text-dark' : '')
        }
        disabled={disabled}
        loading={loading}
        type={primary ? 'primary' : 'default'}
        icon={<PlusCircleOutlined />}
        onClick={() => onAdd()}
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
