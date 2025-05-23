/** @module Components.Signup.Validation */

import { useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, Layout, Space, Spin, Typography } from 'antd'

import { SUBSCRIBE, REVALIDATE } from '@/config/email'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

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
const Validation: React.FunctionComponent = () => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const router = useRouter()
  const { id }: { id?: string } = router.query

  // Link
  useEffect(() => {
    asyncFunctionExec(async () => {
      if (!id) return

      try {
        const link = await LinkAPI.get(id, ['type'])

        if (link.type === SUBSCRIBE || link.type === REVALIDATE) {
          try {
            await LinkAPI.process(id)

            await router.push('/login').catch()
          } catch (err: any) {
            dispatch(addError({ title: errors.internal, err }))
          }
        } else {
          dispatch(addError({ title: errors.wrongLink }))
        }
      } catch (err: any) {
        dispatch(addError({ title: errors.internal, err }))
      }
    })
  }, [id, router, dispatch])

  /**
   * Render
   */
  return (
    <Layout>
      <Card variant="borderless" className={style.signup}>
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
