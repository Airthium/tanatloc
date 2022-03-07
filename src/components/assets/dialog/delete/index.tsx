/** @module Components.Assets.Dialog.Delete */

import PropTypes from 'prop-types'
import { Modal, Space, Typography } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'
import { ReactChild } from 'react'

import { ErrorNotification } from '@/components/assets/notification'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  loading?: boolean
  title: string
  children: ReactChild | ReactChild[]
  onCancel: () => void
  onOk: () => Promise<void>
}

/**
 * Errors
 */
export const errors = {
  onOk: 'Dialog validation error'
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
      className="Dialog"
      title={
        <Typography.Text ellipsis={{ tooltip: true }}>{title}</Typography.Text>
      }
      okText="Delete"
      closable={true}
      visible={visible}
      onCancel={() => onCancel()}
      onOk={async () => {
        try {
          await onOk()
        } catch (err) {
          ErrorNotification(errors.onOk, err, false)
        }
      }}
      okButtonProps={{ danger: true }}
      confirmLoading={loading}
    >
      <Space>
        <ExclamationCircleTwoTone twoToneColor="#ff4d4f" />
        <span>{children}</span>
      </Space>
    </Modal>
  )
}

DeleteDialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  loading: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired
}

export default DeleteDialog
