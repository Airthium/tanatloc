/** @module Components.Loading */

import { Card, Layout, Space, Spin } from 'antd'

/**
 * Simple
 * @returns Loading.Simple
 */
const Simple = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Space
      style={{
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Card>
        <Space>
          <Spin />
          Loading, please wait...
        </Space>
      </Card>
    </Space>
  )
}

export interface IProps {
  text?: string | React.ReactElement | React.ReactElement[]
  description?: string[]
}

/**
 * Loading
 * @returns Loading
 */
const Loading = ({ text, description }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout className="tanatloc-gradient">
      <div className="logo">
        <img src="/images/logo.svg" alt="Tanatloc" />
      </div>
      <Card className="Loading">
        <Space>
          <Spin size="large" />
          {text ?? 'Loading, please wait...'}
        </Space>
        {description && (
          <div className="Loading-description">
            {description?.map((desc, index) => (
              <div key={index}>{desc}</div>
            ))}
          </div>
        )}
      </Card>
    </Layout>
  )
}

Loading.Simple = Simple
export default Loading
