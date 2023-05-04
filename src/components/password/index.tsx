/** @module Components.Password */

import { useCallback, useEffect, useState } from 'react'
import { NextRouter, useRouter } from 'next/router'
import {
  Button,
  Card,
  Form,
  Input,
  Layout,
  Space,
  Spin,
  Typography
} from 'antd'

import { PASSWORD_RECOVERY } from '@/config/email'

import { PasswordItem } from '@/components/assets/input'
import { ErrorNotification, FormError } from '@/components/assets/notification'

import { APIError } from '@/api/error'
import LinkAPI from '@/api/link'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

// Local interfaces
export interface ILocalValues {
  email: string
  password: string
  passwordConfirmation: string
}

/**
 * Errors
 */
export const errors = {
  wrongLink: 'Wrong link',
  incorrect: 'Incorrect data',
  internal: 'Internal error, please try again shortly',
  passwordMismatch: 'Passwords mismatch'
}

/**
 * On finish
 * @param router Router
 * @param linkEmail Link email
 * @param id Link id
 * @param values Values
 */
export const _onFinish = async (
  router: NextRouter,
  linkEmail: string,
  id: string,
  values: ILocalValues
): Promise<void> => {
  if (values.email !== linkEmail)
    throw new APIError({ title: errors.incorrect })
  try {
    await LinkAPI.process(id, {
      email: values.email,
      password: values.password
    })

    await router.push('/login').catch()
  } catch (err: any) {
    throw new APIError({ title: errors.internal, err })
  }
}

/**
 * Password recovery
 * @returns PasswordRecovery
 */
const PasswordRecovery = (): JSX.Element => {
  // State
  const [checking, setChecking] = useState<boolean>(true)
  const [linkEmail, setLinkEmail] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)
  const [formError, setFormError] = useState<APIError>()

  // Data
  const router = useRouter()

  // Id
  const { id }: { id?: string } = router.query

  // Check link type
  useEffect(() => {
    ;(async () => {
      if (!id) return

      try {
        const link = await LinkAPI.get(id, ['type', 'email'])

        if (link.type === PASSWORD_RECOVERY) {
          setLinkEmail(link.email)
          setChecking(false)
        } else {
          ErrorNotification(errors.wrongLink)
        }
      } catch (err: any) {
        ErrorNotification(errors.internal, err)
      }
    })()
  }, [id])

  /**
   * On finish
   * @param values Values
   */
  const onFinish = useCallback(
    (values: ILocalValues): void => {
      ;(async () => {
        setLoading(true)
        try {
          await _onFinish(router, linkEmail!, id!, values)
        } catch (err: any) {
          setFormError(err)
          setLoading(false)
        }
      })()
    },
    [router, linkEmail, id]
  )

  /**
   * Render
   */
  if (checking)
    return (
      <Layout>
        <Card bordered={false} className={style.password}>
          <Spin /> Loading...
        </Card>
      </Layout>
    )
  return (
    <Layout>
      <Card bordered={false} className={style.password}>
        <Space
          direction="vertical"
          size="large"
          className={globalStyle.fullWidth}
        >
          <div>
            <Typography.Title
              level={1}
              style={{ padding: 0, marginBottom: 16, fontWeight: 500 }}
            >
              Password recovery
            </Typography.Title>
          </div>
          <Form requiredMark="optional" onFinish={onFinish} layout="vertical">
            <Form.Item
              name="email"
              label="Enter your email address"
              rules={[{ required: true, message: 'Email is required' }]}
            >
              <Input placeholder="Email address" autoComplete="email" />
            </Form.Item>
            <PasswordItem
              name="password"
              label="Choose your password"
              inputPlaceholder="Password"
              style={{ marginBottom: '14px' }}
            />
            <Form.Item
              name="passwordConfirmation"
              label="Confirm your password"
              rules={[
                {
                  required: true,
                  message: 'Password confirmation is required'
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve()
                    }
                    return Promise.reject(errors.passwordMismatch)
                  }
                })
              ]}
              style={{ marginBottom: '14px' }}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>
            <FormError error={formError} />
            <Form.Item className={style.submit}>
              <Button type="primary" loading={loading} htmlType="submit">
                Finish
              </Button>
            </Form.Item>
          </Form>
        </Space>
      </Card>
    </Layout>
  )
}

export default PasswordRecovery
