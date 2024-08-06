/** @module Components.Assets.Dialog.Delete */

import { ReactNode, useCallback, useContext } from 'react'
import { Modal, Space, Typography } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  loading?: boolean
  title: string
  children: ReactNode
  onCancel: () => void
  onOk: () => Promise<void>
}

/**
 * Errors
 */
export const errors = {
  onOk: 'Error while submitting deletion'
}

/**
 * DeleteDialog
 * @param props Props
 *
 * Props list:
 * - visible (boolean) Dialog visible
 * - loading (boolean) Dialog loading
 * - title (string) Dialog title
 * - children (React node) Dialog children
 * - onCancel (Function) Dialog cancel
 * - onOk (Function) Dialog ok
 * @returns DeleteDialog
 */
const DeleteDialog: React.FunctionComponent<IProps> = ({
  visible,
  loading,
  title,
  children,
  onCancel,
  onOk
}) => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  /**
   * On ok
   */
  const internalOnOk = useCallback((): void => {
    asyncFunctionExec(async () => {
      try {
        await onOk()
      } catch (err: any) {
        dispatch(addError({ title: errors.onOk, err, display: false }))
      }
    })
  }, [onOk, dispatch])

  /**
   * Render
   */
  return (
    <Modal
      title={
        <Typography.Text ellipsis={{ tooltip: true }}>
          {title}{' '}
          <ExclamationCircleTwoTone
            twoToneColor="#ff4d4f"
            style={{ marginLeft: '8px' }}
          />
        </Typography.Text>
      }
      okText="Delete"
      closable={false}
      maskClosable={false}
      open={visible}
      cancelButtonProps={{ disabled: loading }}
      onCancel={onCancel}
      onOk={internalOnOk}
      okButtonProps={{ danger: true, loading: loading }}
    >
      <Space align="start">
        <span style={{ wordBreak: 'break-word' }}>{children}</span>
      </Space>
    </Modal>
  )
}

export default DeleteDialog
