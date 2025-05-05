/** @module Components.Notfound */

import { useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { Button, Layout, Typography } from 'antd'

// Tanatloc3D 404
const NotFoundCone = dynamic(
  () =>
    import('@airthium/tanatloc-3d').then((mod) => mod.default.extra.NotFound),
  { ssr: false }
)

import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import style from '@/components/notfound/index.module.css'

/**
 * 404
 * @returns NotFound
 */
const NotFound: React.FunctionComponent = () => {
  // Router
  const router = useRouter()

  /**
   * Home
   */
  const home = useCallback((): void => {
    asyncFunctionExec(async () => {
      await router.push('/')
    })
  }, [router])

  /**
   * Render
   */
  return (
    <Layout className={style.index}>
      <Layout.Content className={style.content}>
        <div className={style.title}>
          <Typography.Title level={1} style={{ textAlign: 'center' }}>
            Page not found
          </Typography.Title>
        </div>
        <NotFoundCone />
        <div className={style.description}>
          <Typography.Title level={3} style={{ textAlign: 'center' }}>
            The requested URL was not found on the server
          </Typography.Title>
          <Button
            type="primary"
            className={style.descriptionButton}
            onClick={home}
          >
            Return to Home
          </Button>
        </div>
      </Layout.Content>
    </Layout>
  )
}

export default NotFound
