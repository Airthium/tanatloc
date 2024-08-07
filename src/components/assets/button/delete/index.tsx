/** @module Components.Assets.Button.Delete */

import { ReactNode, useCallback, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { DeleteDialog } from '@/components/assets/dialog'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  loading?: boolean
  bordered?: boolean
  text?: string | React.ReactElement
  title?: string
  children?: ReactNode
  onDelete: () => Promise<void>
}

/**
 * Delete button
 * @param props Props
 *
 * Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - bordered (boolean) Set border
 * - text (string) DeleteDialog text
 * - title (string) DeleteDialog title
 * - children (React child) Button children
 * - onDelete (async Function) DeleteDialog click (this function can throw an error)
 * @returns DeleteButton
 */
const DeleteButton: React.FunctionComponent<IProps> = ({
  disabled,
  loading,
  bordered,
  text,
  title,
  children,
  onDelete
}) => {
  // State
  const [visible, setVisible] = useState<boolean>(false)

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  /**
   * On ok
   */
  const onOk = useCallback(async () => {
    await onDelete()
    setVisible(false)
  }, [onDelete])

  /**
   * Render
   */
  return (
    <>
      <DeleteDialog
        visible={visible}
        loading={loading}
        title={title ?? 'Delete'}
        onCancel={setVisibleFalse}
        onOk={onOk}
      >
        {text ?? 'Are you sure?'}
      </DeleteDialog>
      <Tooltip title={children ?? 'Delete'}>
        <Button
          className={`${globalStyle.noBackground} ${
            bordered ? '' : globalStyle.noBorder
          }`}
          danger
          disabled={disabled}
          type={disabled ? 'link' : undefined}
          loading={loading}
          icon={<DeleteOutlined />}
          onClick={setVisibleTrue}
        >
          {children}
        </Button>
      </Tooltip>
    </>
  )
}

export default DeleteButton
