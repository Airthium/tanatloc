/** @module components/assets/dialog */

import { useEffect } from 'react'
import { Form, Modal } from 'antd'

import DeleteDialog from './delete'

/**
 * Dialog
 * @param {Object} props Props
 */
const Dialog = (props) => {
  // Props
  const title = props.title
  const visible = props.visible
  const initialValues = props.initialValues
  const onCancel = props.onCancel
  const onOk = props.onOk
  const loading = props.loading

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
      title={title}
      visible={visible}
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      onOk={async () => {
        try {
          const values = await form.validateFields()
          await onOk(values)
          form.resetFields()
        } catch (info) {
          console.warn('Validation Failed:', info)
        }
      }}
      confirmLoading={loading}
    >
      <Form form={form} {...layout} initialValues={initialValues}>
        {props.children}
      </Form>
    </Modal>
  )
}

export default Dialog
export { DeleteDialog }
