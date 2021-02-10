/** @module 'src/components/loading */

import { Card, Layout, Space, Spin } from 'antd'

import Background from '@/components/background'

/**
 * Loading
 */
const Loading = () => {
  /**
   * Render
   */
  return (
    <Layout className="tanatloc-gradient">
      <Background />
      <div className="logo">
        <img src="/images/logo.svg" />
      </div>
      <Card className="Loading">
        <Space>
          <Spin size="large" />
          Loading, please wait...
        </Space>
      </Card>
    </Layout>
  )
}

export default Loading
