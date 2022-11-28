/** @module Components.Assets.Dialog.Delete */

import { Modal, Space, Typography } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'

import { ErrorNotification } from '@/components/assets/notification'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  loading?: boolean
  title: string
  children: string | React.ReactElement | React.ReactElement[]
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
 * @description Props list:
 * - visible (boolean) Dialog visible
 * - loading (boolean) Dialog loading
 * - title (string) Dialog title
 * - children (React node) Dialog children
 * - onCancel (Function) Dialog cancel
 * - onOk (Function) Dialog ok
 * @returns DeleteDialog
 */
const DeleteDialog = ({
  visible,
  loading,
  title,
  children,
  onCancel,
  onOk
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Modal
      title={
        <Typography.Text ellipsis={{ tooltip: true }}>{title}</Typography.Text>
      }
      okText="Delete"
      closable={false}
      maskClosable={false}
      open={visible}
      cancelButtonProps={{ disabled: loading }}
      onCancel={() => onCancel()}
      onOk={async () => {
        try {
          await onOk()
        } catch (err) {
          ErrorNotification(errors.onOk, err, false)
        }
      }}
      okButtonProps={{ danger: true, loading: loading }}
    >
      <Space align="start">
        <ExclamationCircleTwoTone twoToneColor="#ff4d4f" />
        <span style={{ wordBreak: 'break-word' }}>{children}</span>
      </Space>
    </Modal>
  )
}

export default DeleteDialog
