import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Card, Layout, Space, Spin, Typography } from 'antd'

import { SUBSCRIBE, REVALIDATE } from '@/config/email'

import { Error as ErrorNotification } from '@/components/assets/notification'

import LinkAPI from '@/api/link'

/**
 * Errors (validation)
 * @memberof Components.Signup
 */
const errors = {
  internal: 'Internal error'
}

/**
 * Validation
 * @memberof Components.Signup
 * @returns {jxs} Render
 */
const Validation = () => {
  const router = useRouter()

  const { id } = router.query

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
            ErrorNotification('Wrong link')
          }
        })
        .catch((err) => ErrorNotification(errors.internal, err))
    }
  }, [id])

  /**
   * Render
   */
  return (
    <Layout>
      <Card bordered={false} className="Signup">
        <Space direction="vertical" style={{ width: '100%' }}>
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
