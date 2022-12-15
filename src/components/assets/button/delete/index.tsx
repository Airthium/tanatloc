/** @module Components.Assets.Button.Delete */

import { useCallback, useState } from 'react'
import { Button, Tooltip } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'

import { DeleteDialog } from '@/components/assets/dialog'

import { globalStyle } from '@/styles'

/**
 * Props
 */
export interface IProps {
  disabled?: boolean
  loading?: boolean
  bordered?: boolean
  text?: string | React.ReactElement
  title?: string
  children?: string | React.ReactElement | React.ReactElement[]
  onDelete: () => Promise<void>
}

/**
 * Delete button
 * @param props Props
 * @description Props list:
 * - disabled (boolean) Set disabled state
 * - loading (boolean) Set loading state
 * - bordered (boolean) Set border
 * - text (string) DeleteDialog text
 * - title (string) DeleteDialog title
 * - children (React child) Button children
 * - onDelete (async Function) DeleteDialog click (this function can throw an error)
 * @returns DeleteButton
 */
const DeleteButton = ({
  disabled,
  loading,
  bordered,
  text,
  title,
  children,
  onDelete
}: IProps): JSX.Element => {
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
        title={title || 'Delete'}
        onCancel={setVisibleFalse}
        onOk={onOk}
      >
        {text || 'Are you sure?'}
      </DeleteDialog>
      <Tooltip title={children || 'Delete'}>
        <Button
          css={css([
            globalStyle.noBackground,
            bordered ? {} : globalStyle.noBorder
          ])}
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
