import PropTypes from 'prop-types'
import { ReactChild } from 'react'
import { Button, Tooltip } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

export interface IProps {
  disabled?: boolean
  primary?: boolean
  light?: boolean
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
  light = false,
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
        className={light && 'text-light'}
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
