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
  okButtonProps,
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
    layout: 'vertical'
  }

  /**
   * Render
   */
  return (
    <Modal
      className="Dialog"
      title={title}
      visible={visible}
      onCancel={
        onCancel &&
        (() => {
          form.resetFields()
          onCancel()
        })
      }
      cancelButtonProps={{ display: onCancel ? 'inline-block' : 'none' }}
      onOk={
        onOk &&
        (async () => {
          try {
            const values = await form.validateFields()
            await onOk(values)
            form.resetFields()
          } catch (err) {}
        })
      }
      okButtonProps={{
        ...okButtonProps,
        display: onOk ? 'inline-block' : 'none'
      }}
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
  onOk: PropTypes.func,
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
