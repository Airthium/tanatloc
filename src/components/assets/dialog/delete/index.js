import { Modal, Space } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'

/**
 * DeleteDialog
 * @memberof module:'src/components/assets/dialog
 * @param {Object} props Props
 */
const DeleteDialog = (props) => {
  // Props
  const visible = props.visible
  const onCancel = props.onCancel
  const onOk = props.onOk
  const loading = props.loading

  /**
   * Render
   */
  return (
    <Modal
      title="Delete your account"
      okText="Delete"
      closable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={loading}
    >
      <Space size="middle">
        <ExclamationCircleTwoTone
          twoToneColor="#faad14"
          style={{ fontSize: '1.5em' }}
        />
        <span>{props.children}</span>
      </Space>
    </Modal>
  )
}

export default DeleteDialog
