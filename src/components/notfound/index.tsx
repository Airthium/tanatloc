/** @module Components.Notfound */

import { useRouter } from 'next/router'
import { Layout, Typography } from 'antd'

import Side from '@/components/assets/side'
import Menu, { scrollToView } from '@/components/indexpage/menu'
import Footer from '@/components/indexpage/footer'

/**
 * 404
 * @returns NotFound
 */
const NotFound = (): JSX.Element => {
  // Router
  const router = useRouter()

  /**
   * Render
   */
  return (
    <Layout className="Index">
      <Menu />
      <Layout.Content>
        <Side
          left={
            <>
              <Typography.Title level={1}></Typography.Title>
              <Typography.Title level={1}>404</Typography.Title>
              <Typography.Title level={1}>Page not found</Typography.Title>
              <Typography.Title level={1}></Typography.Title>
            </>
          }
          right={<></>}
        />
        <Side
          left={
            <>
              <Typography.Title level={2}>
                The page you are trying to reach does not exist
              </Typography.Title>
            </>
          }
          right={
            <Typography.Title
              level={2}
              underline={true}
              onClick={() => router.push('/')}
              style={{ cursor: 'pointer' }}
            >
              Come back home
            </Typography.Title>
          }
        />
      </Layout.Content>
      <Footer scroll={scrollToView} />
    </Layout>
  )
}

export default NotFound
