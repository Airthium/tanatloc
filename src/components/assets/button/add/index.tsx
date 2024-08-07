/** @module Components.Assets.Button.Add */

import { ReactNode } from 'react'
import { Button, Tooltip } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import globalStyle from '@/styles/index.module.css'

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
  children?: ReactNode
  onAdd: () => void
}

/**
 * Add button
 * @param props Props
 *
 * Props list:
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
const AddButton: React.FunctionComponent<IProps> = ({
  disabled,
  primary = true,
  light,
  dark,
  fullWidth,
  needMargin,
  loading,
  children,
  onAdd
}) => {
  /**
   * Render
   */
  return (
    <Tooltip title={children ?? 'Add'}>
      <Button
        className={`${fullWidth ? globalStyle.fullWidth : ''} ${
          light ? globalStyle.textLight : ''
        } ${dark ? globalStyle.textDark : ''}`}
        style={needMargin ? { marginLeft: '5px' } : {}}
        disabled={disabled}
        loading={loading}
        type={primary ? 'primary' : 'default'}
        icon={<PlusCircleOutlined />}
        onClick={onAdd}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

export default AddButton
