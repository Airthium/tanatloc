/** @module Components.Assets.Dialog */

import { useCallback, useContext, useEffect } from 'react'
import { Form, Modal, ModalProps, Typography } from 'antd'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import DeleteDialog from './delete'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  loading?: boolean
  title: string
  initialValues?: object
  okButtonProps?: ModalProps['okButtonProps']
  okButtonText?: string
  cancelButtonProps?: ModalProps['cancelButtonProps']
  cancelButtonText?: string
  children: string | React.ReactElement | React.ReactElement[]
  onCancel?: () => void
  onOk?: (values: any) => Promise<void>
}

/**
 * Errors
 */
export const errors = {
  onOk: 'Error while submitting data'
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
}: IProps): React.JSX.Element => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  // Form
  const [form] = Form.useForm()

  // Inital values update
  useEffect(() => {
    if (visible && initialValues) form.setFieldsValue(initialValues)
  }, [visible, initialValues, form])

  /**
   * On Modal ok
   */
  const onModalOk = useCallback((): void => {
    ;(async () => {
      if (!onOk) return
      try {
        const values = await form.validateFields()
        await onOk(values)
        form.resetFields()
      } catch (err: any) {
        dispatch(addError({ title: errors.onOk, err, display: false }))
      }
    })()
  }, [form, onOk, dispatch])

  /**
   * On key up
   * @param event Event
   */
  const onKeyUp = useCallback(
    (event: { keyCode: number }): void => {
      if (event.keyCode === 13) {
        onModalOk()
      }
    },
    [onModalOk]
  )

  /**
   * On modal cancel
   */
  const onModalCancel = useCallback((): void => {
    form.resetFields()
    onCancel?.()
  }, [form, onCancel])

  /**
   * Render
   */
  return (
    <Modal
      title={
        <Typography.Text ellipsis={{ tooltip: true }}>{title}</Typography.Text>
      }
      open={visible}
      closable={false}
      maskClosable={false}
      onCancel={onModalCancel}
      cancelButtonProps={{
        ...cancelButtonProps,
        disabled: loading,
        style: { display: onCancel ? 'inline-block' : 'none' }
      }}
      cancelText={cancelButtonText}
      onOk={onModalOk}
      okText={okButtonText}
      okButtonProps={{
        ...okButtonProps,
        loading: loading,
        style: { display: onOk ? 'inline-block' : 'none' }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={initialValues}
        onKeyUp={onKeyUp}
      >
        {children}
      </Form>
    </Modal>
  )
}

export default Dialog
export { DeleteDialog }
