/** @module renderer/components/loading */

import { Card, Layout, Space, Spin } from 'antd'

/**
 * Loading
 */
const Loading = () => {
  /**
   * Render
   */
  return (
    <Layout className="tanatloc-gradient">
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
