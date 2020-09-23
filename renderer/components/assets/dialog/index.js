/** @module renderer/components/assets/dialog */

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
  const onCancel = props.onCancel
  const onOk = props.onOk
  const loading = props.loading

  // Form
  const [form] = Form.useForm()

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
          console.log('Validate Failed:', info)
        }
      }}
      confirmLoading={loading}
    >
      <Form form={form}>{props.children}</Form>
    </Modal>
  )
}

export default Dialog
export { DeleteDialog }
