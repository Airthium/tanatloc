import PropTypes from 'prop-types'
import { ReactChild } from 'react'
import { Button, Tooltip } from 'antd'

export interface IProps {
  disabled?: boolean
  loading?: boolean
  children?: ReactChild | ReactChild[]
  onCancel: () => void
}

/**
 * Cancel button
 * @memberof Components.Assets.Button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - children (React child) Button children
 * - onCancel (Function) Button click
 */
const CancelButton = ({
  disabled,
  loading,
  children,
  onCancel
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Tooltip title={children || 'Add'}>
      <Button
        disabled={disabled}
        loading={loading}
        type="default"
        onClick={onCancel}
      >
        {children}
      </Button>
    </Tooltip>
  )
}

CancelButton.propTypes = {
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  children: PropTypes.node,
  onCancel: PropTypes.func.isRequired
}

export default CancelButton
