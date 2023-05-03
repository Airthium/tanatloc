/** @module Components.Login.Password */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Form, Input, InputRef, Typography } from 'antd'

import Dialog from '@/components/assets/dialog'
import {
  SuccessNotification,
  ErrorNotification
} from '@/components/assets/notification'

import EmailAPI from '@/api/email'

/**
 * Errors
 */
export const errors = {
  recover: 'Unable to recover password'
}

/**
 * Password recover
 * @param value Value
 */
export const _passwordRecover = async (value: {
  email: string
}): Promise<void> => {
  try {
    await EmailAPI.recover(value.email)

    SuccessNotification(
      'An email has been send to recover your password',
      'If you entered a valid email'
    )
  } catch (err: any) {
    ErrorNotification(errors.recover, err)
    throw err
  }
}

/**
 * Password recover
 * @returns PasswordRecover
 */
const PasswordRecover = (): JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Autofocus
  useEffect(() => {
    /* istanbul ignore next */
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback(() => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [])

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(async (values: { email: string }): Promise<void> => {
    setLoading(true)
    try {
      await _passwordRecover(values)

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      setLoading(false)
      throw err
    }
  }, [])

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Forgot your password ?"
        visible={visible}
        onCancel={setVisibleFalse}
        onOk={onOk}
        loading={loading}
      >
        <Form.Item
          name="email"
          label="Your email address"
          rules={[{ required: true, message: 'Email is required' }]}
        >
          <Input
            ref={inputRef}
            placeholder="Email address"
            autoComplete="email"
          />
        </Form.Item>
      </Dialog>
      <Typography.Text>
        <Button type="link" onClick={setVisibleTrue}>
          Forgot your password ?
        </Button>
      </Typography.Text>
    </>
  )
}

export default PasswordRecover
