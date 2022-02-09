/** @module Components.Help */

import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import HPC from './doc/hpc'
import Administration from './doc/administration'
import Organizations from './doc/organizations'

/**
 * Help
 * @memberof Components.Help
 */
const Help = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout className="inDashboard Help">
      <PageHeader
        className="inDashboard-PageHeader"
        backIcon={false}
        title={
          <Typography.Title level={2} className="inDashboard-PageHeader-title">
            Help
          </Typography.Title>
        }
        footer={<Divider />}
      />
      <Layout.Content className="scroll">
        <Space direction="vertical" style={{ width: '100%' }}>
          <HPC />
          <Organizations />
          <Administration />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Help
