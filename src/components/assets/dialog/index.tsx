/** @module Components.Assets.Dialog */

import PropTypes from 'prop-types'
import { useEffect } from 'react'
import { Form, Modal, Typography } from 'antd'
import { BaseButtonProps } from 'antd/lib/button/button'

import { ErrorNotification } from '@/components/assets/notification'

import DeleteDialog from './delete'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  closable?: boolean
  loading?: boolean
  title: string
  initialValues?: object
  okButtonProps?: BaseButtonProps
  okButtonText?: string
  cancelButtonProps?: BaseButtonProps
  cancelButtonText?: string
  children: string | React.ReactElement | React.ReactElement[]
  onCancel?: () => void
  onOk?: (values: any) => Promise<void>
}

/**
 * Errors
 */
export const errors = {
  onOk: 'Dialog validation error'
}

/**
 * Dialog
 * @param props Props
 * @description Props list:
 * - visible (boolean) Dialog visible
 * - closable (boolean) Dialog closable
 * - loading (boolean) Form loading
 * - title (string) Dialog title
 * - initialValues (Object) Form initial values
 * - okButtonProps (Object) Ok button props
 * - okButtonText (string) Ok button text
 * - cancelButtonProps (Object) Cancel button props
 * - cancelButtonText (string) Cancel button text
 * - children (React node) Form children
 * - onCancel (Function) Dialog cancel
 * - onOk (Function) Dialog ok
 * @returns Dialog
 */
const Dialog = ({
  visible,
  closable = true,
  loading,
  title,
  initialValues,
  cancelButtonText,
  cancelButtonProps,
  okButtonProps,
  okButtonText,
  children,
  onCancel,
  onOk
}: IProps): JSX.Element => {
  // Form
  const [form] = Form.useForm()

  // Inital values update
  useEffect(() => {
    if (visible && initialValues) form.setFieldsValue(initialValues)
  }, [visible, initialValues, form])

  /**
   * Render
   */
  return (
    //@ts-ignore
    <Modal
      className="Dialog"
      title={
        <Typography.Text ellipsis={{ tooltip: true }}>{title}</Typography.Text>
      }
      visible={visible}
      closable={closable}
      maskClosable={closable}
      onCancel={
        onCancel &&
        (() => {
          form.resetFields()
          onCancel()
        })
      }
      cancelButtonProps={{
        ...cancelButtonProps,
        style: { display: onCancel ? 'inline-block' : 'none' }
      }}
      cancelText={cancelButtonText}
      onOk={
        onOk &&
        (async () => {
          try {
            const values = await form.validateFields()
            await onOk(values)
            form.resetFields()
          } catch (err) {
            ErrorNotification(errors.onOk, err, false)
          }
        })
      }
      okText={okButtonText}
      okButtonProps={{
        ...okButtonProps,
        style: { display: onOk ? 'inline-block' : 'none' }
      }}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical" initialValues={initialValues}>
        {children}
      </Form>
    </Modal>
  )
}

Dialog.propTypes = {
  visible: PropTypes.bool.isRequired,
  closable: PropTypes.bool,
  loading: PropTypes.bool,
  title: PropTypes.string.isRequired,
  initialValues: PropTypes.object,
  okButtonProps: PropTypes.object,
  okButtonText: PropTypes.string,
  children: PropTypes.node.isRequired,
  onCancel: PropTypes.func,
  onOk: PropTypes.func
}

export default Dialog
export { DeleteDialog }
