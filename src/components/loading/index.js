/** @namespace Components.Loading */

import { Card, Layout, Space, Spin } from 'antd'

import Background from '@/components/background'

/**
 * Simple
 * @memberof Components.Loading
 */
const Simple = () => {
  /**
   * Render
   */
  return (
    <Space
      direction=""
      style={{
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card>
        <Space direction="">
          <Spin />
          Loading, please wait...
        </Space>
      </Card>
    </Space>
  )
}

/**
 * Loading
 * @memberof Components.Loading
 */
const Loading = () => {
  /**
   * Render
   */
  return (
    <Layout className="tanatloc-gradient">
      <Background />
      <div className="logo">
        <img src="/images/logo.svg" alt="Tanatloc" />
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

Loading.Simple = Simple
export default Loading
