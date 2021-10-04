/** @namespace Components.Help */

import { Card, Layout, Space } from 'antd'

import HPC from './doc/hpc'
import Administration from './doc/administration'
import Organizations from './doc/organizations'

/**
 * Help
 * @memberof Components.Help
 */
const Help = () => {
  /**
   * Render
   */
  return (
    <Layout className="help">
      <Layout.Content>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Card title="Documentation" bordered={false}>
            <Space direction="vertical" style={{ width: '100%' }}>
              <HPC />
              <Organizations />
              <Administration />
            </Space>
          </Card>
          <Card title="Support" bordered={false}></Card>
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Help
