import PropTypes from 'prop-types'
import { Modal, Space } from 'antd'
import { ExclamationCircleTwoTone } from '@ant-design/icons'

/**
 * DeleteDialog
 * @memberof module:components/assets/dialog
 * @param {Object} props Props
 */
const DeleteDialog = ({
  title,
  visible,
  onCancel,
  onOk,
  loading,
  children
}) => {
  /**
   * Render
   */
  return (
    <Modal
      title={title}
      okText="Delete"
      closable={false}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      confirmLoading={loading}
    >
      <Space direction="">
        <ExclamationCircleTwoTone
          twoToneColor="#faad14"
          style={{ fontSize: '1.5em' }}
        />
        <span>{children}</span>
      </Space>
    </Modal>
  )
}

DeleteDialog.propTypes = {
  title: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  onOk: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
    .isRequired
}

export default DeleteDialog
