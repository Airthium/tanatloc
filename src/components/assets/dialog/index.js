/** @module components/assets/dialog */

import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Form, Modal } from 'antd'

import DeleteDialog from './delete'

/**
 * Dialog
 * @param {Object} props Props
 */
const Dialog = ({
  title,
  visible,
  initialValues,
  onCancel,
  onOk,
  loading,
  children
}) => {
  // Form
  const [form] = Form.useForm()

  // Inital values update
  useEffect(() => {
    if (visible && initialValues) form.setFieldsValue(initialValues)
  }, [visible, initialValues])

  // Layout
  const layout = {
    layout: 'horizontal',
    labelCol: { span: 4 },
    wrapperCol: { span: 20 }
  }

  /**
   * Render
   */
  return (
    <Modal
      className="Dialog"
      title={title}
      visible={visible}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      cancelButtonProps={{ type: 'danger' }}
      onOk={async () => {
        try {
          const values = await form.validateFields()
          await onOk(values)
          form.resetFields()
        } catch (err) {}
      }}
      okButtonProps={{ type: 'primary' }}
      confirmLoading={loading}
    >
      <Form form={form} {...layout} initialValues={initialValues}>
        {children}
      </Form>
    </Modal>
  )
}

Dialog.propTypes = {
  title: PropTypes.string,
  visible: PropTypes.bool.isRequired,
  initialValues: PropTypes.object,
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

export default Dialog
export { DeleteDialog }
