/** @namespace Components.Assets.Dialog */

import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Form, Modal } from 'antd'

import DeleteDialog from './delete'

/**
 * Dialog
 * @memberof Components.Assets.Dialog
 * @param {Object} props Props `{ visible, loading, title, initialValues, okButtonProps, children, onCancel, onOk }`
 * @description Props list:
 * - visible (boolean) Dialog visible
 * - closable (boolean) Dialog closable
 * - loading (boolean) Form loading
 * - title (string) Dialog title
 * - initialValues (Object) Form initial values
 * - okButtonProps (Object) Ok button props
 * - children (React node) Form children
 * - onCancel (Function) Dialog cancel
 * - onOk (Function) Dialog ok
 */
const Dialog = ({
  visible,
  closable,
  loading,
  title,
  initialValues,
  okButtonProps,
  children,
  onCancel,
  onOk
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
      closable={closable === undefined ? true : closable}
      maskClosable={closable === undefined ? true : closable}
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
      okText={okButtonProps?.text}
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
  onCancel: PropTypes.func,
  onOk: PropTypes.func,
  loading: PropTypes.bool,
  children: PropTypes.node.isRequired
}

export default Dialog
export { DeleteDialog }
