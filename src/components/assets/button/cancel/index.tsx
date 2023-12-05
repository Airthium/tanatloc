/** @module Components.Assets.Button.Cancel */

import { ReactNode } from 'react'
import { Button, Tooltip } from 'antd'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  loading?: boolean
  children?: ReactNode
  onCancel: () => void
}

/**
 * Cancel button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - children (React child) Button children
 * - onCancel (Function) Button click
 * @returns CancelButton
 */
const CancelButton = ({
  disabled,
  loading,
  children,
  onCancel
}: IProps): ReactNode => {
  /**
   * Render
   */
  return (
    <Tooltip title={children ?? 'Cancel'}>
      <Button
        disabled={disabled}
        loading={loading}
        type="default"
        onClick={onCancel}
      >
        {children ?? 'Cancel'}
      </Button>
    </Tooltip>
  )
}

export default CancelButton
