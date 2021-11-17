import PropTypes from 'prop-types'
import { Modal, Space } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'
import { ReactChild } from 'react'

interface IProps {
  visible: boolean
  loading?: boolean
  title: string
  children: ReactChild | ReactChild[]
  onCancel: Function
  onOk: Function
}

/**
 * DeleteDialog
 * @memberof Components.Assets.Dialog
 * @param {Object} props Props `{ visible, loading, title, children, onCancel, onOk }`
 * @description Props list:
 * - visible (boolean) Dialog visible
 * - loading (boolean) Dialog loading
 * - title (string) Dialog title
 * - children (React node) Dialog children
 * - onCancel (Function) Dialog cancel
 * - onOk (Function) Dialog ok
 */
const DeleteDialog = ({
  visible,
  loading,
  title,
  children,
  onCancel,
  onOk
}) => {
  /**
   * Render
   */
  return (
    <Modal
      className="Dialog"
      title={title}
      okText="Delete"
      closable={true}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      okButtonProps={{ danger: true }}
      confirmLoading={loading}
    >
      <Space>
        <ExclamationCircleTwoTone
          twoToneColor="#ff4d4f"
          style={{ fontSize: '1.5em' }}
        />
        <span>{children}</span>
      </Space>
    </Modal>
  )
}

DeleteDialog.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.node.isRequired
}

export default DeleteDialog
