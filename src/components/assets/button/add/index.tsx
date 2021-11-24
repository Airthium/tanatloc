import PropTypes from 'prop-types'
import { ReactChild } from 'react'
import { Button, Tooltip } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

export interface IProps {
  disabled?: boolean
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
        disabled={disabled}
        loading={loading}
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
