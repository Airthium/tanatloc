/** @module Components.Assets.Button.Edit */

import { Button, Tooltip } from 'antd'
import { EditOutlined } from '@ant-design/icons'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
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
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - primary (boolean) Set Button type
 * - bordered (boolean) Set border
 * - light (boolean) Set Button text to light
 * - dark (boolean) Set Button text to dark
 * - needMargin (boolean) Set Button left margin to 5px
 * - loading (boolean) Set loading state
 * - children (React node) Button children
 * - onEdit (Function) Button click
 * @returns EditButton
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
}: IProps): React.JSX.Element => {
  let type: 'link' | 'primary' | 'default'
  if (disabled) type = 'link'
  else if (primary) type = 'primary'
  else type = 'default'

  /**
   * Render
   */
  return (
    <Tooltip title={children ?? 'Edit'}>
      <Button
        className={`${type == 'primary' ? '' : globalStyle.noBackground} ${
          light ? globalStyle.textLight : ''
        } ${dark ? globalStyle.textDark : ''} ${
          bordered ? '' : globalStyle.noBorder
        }`}
        style={needMargin ? { marginLeft: '5px' } : {}}
        disabled={disabled}
        loading={loading}
        type={type}
        icon={<EditOutlined />}
        onClick={onEdit}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

export default EditButton
