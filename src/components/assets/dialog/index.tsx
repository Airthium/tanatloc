/** @module Components.Assets.Dialog */

import PropTypes from 'prop-types'
import { ReactChild, useEffect } from 'react'
import { Form, Modal } from 'antd'
import { BaseButtonProps } from 'antd/lib/button/button'

import { Error as ErrorNotification } from '@/components/assets/notification'
import DeleteDialog from './delete'

export interface IProps {
  visible: boolean
  closable?: boolean
  loading?: boolean
  title: string
  initialValues?: object
  cancelButtonText?: string
  okButtonProps?: BaseButtonProps
  okButtonText?: string
  children: ReactChild | ReactChild[]
  onCancel?: Function
  onOk?: Function
}

/**
 * Errors
 */
const errors = {
  onOk: 'Dialog validation error'
}

/**
 * Dialog
 * @memberof Components.Assets.Dialog
 * @param props Props
 * @description Props list:
 * - visible (boolean) Dialog visible
 * - closable (boolean) Dialog closable
 * - loading (boolean) Form loading
 * - title (string) Dialog title
 * - initialValues (Object) Form initial values
 * - cancelButtonText (string) Cancel button text
 * - okButtonProps (Object) Ok button props
 * - okButtonText (string) Ok button text
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
  cancelButtonText,
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
  }, [visible, initialValues])

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
      cancelButtonProps={{
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
            err.message && ErrorNotification(errors.onOk, err)
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
