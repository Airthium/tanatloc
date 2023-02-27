/** @module Components.Signup.Validation */

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, Layout, Space, Spin, Typography } from 'antd'

import { SUBSCRIBE, REVALIDATE } from '@/config/email'

import { ErrorNotification } from '@/components/assets/notification'

import LinkAPI from '@/api/link'

import globalStyle from '@/styles/index.module.css'
import style from '../index.module.css'

/**
 * Errors
 */
export const errors = {
  wrongLink: 'Wrong link',
  internal: 'Internal error, please try again shortly'
}

/**
 * Validation
 * @returns Validation
 */
const Validation = (): JSX.Element => {
  // Data
  const router = useRouter()
  const { id }: { id?: string } = router.query

  // Link
  useEffect(() => {
    if (id) {
      LinkAPI.get(id, ['type'])
        .then((res) => {
          if (res.type === SUBSCRIBE || res.type === REVALIDATE) {
            LinkAPI.process(id)
              .then(() => {
                router.push('/login')
              })
              .catch((err) => ErrorNotification(errors.internal, err))
          } else {
            ErrorNotification(errors.wrongLink)
          }
        })
        .catch((err) => ErrorNotification(errors.internal, err))
    }
  }, [id, router])

  /**
   * Render
   */
  return (
    <Layout>
      <Card bordered={false} className={style.signup}>
        <Space direction="vertical" className={globalStyle.fullWidth}>
          <Typography.Text>
            <Spin /> Validating...
          </Typography.Text>
          {!id && (
            <Typography.Text type="warning">
              No link identifier detected
            </Typography.Text>
          )}
        </Space>
      </Card>
    </Layout>
  )
}

export default Validation
