/** @module Components.Assets.Button.Add */

import PropTypes from 'prop-types'
import { ReactChild } from 'react'
import { Button, Tooltip } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  primary?: boolean
  light?: boolean
  dark?: boolean
  fullWidth?: boolean
  needMargin?: boolean
  loading?: boolean
  children?: ReactChild | ReactChild[]
  onAdd: () => void
}

/**
 * Add button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - primary (boolean) Set Button type
 * - light (boolean) Set Button text to light
 * - dark (boolean) Set Button text to dark
 * - fullWidth (boolean) Set Button width to 100%
 * - needMargin (boolean) Set Button left margin to 5px
 * - loading (boolean) Set loading state
 * - children (React child) Button children
 * - onAdd (Function) Button click
 * @returns AddButton
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
          (needMargin ? ' marginLeft-5' : '') +
          (light ? ' text-light' : '') +
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
  primary: PropTypes.bool,
  light: PropTypes.bool,
  dark: PropTypes.bool,
  fullWidth: PropTypes.bool,
  needMargin: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  onAdd: PropTypes.func.isRequired
}

export default AddButton
