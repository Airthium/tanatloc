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
      className="Dialog"
      title={title}
      okText="Delete"
      closable={true}
      visible={visible}
      onCancel={onCancel}
      onOk={onOk}
      okButtonProps={{ type: 'danger' }}
      confirmLoading={loading}
    >
      <Space direction="">
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
  children: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array,
    PropTypes.element
  ]).isRequired
}

export default DeleteDialog
