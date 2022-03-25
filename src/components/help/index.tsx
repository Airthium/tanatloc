/** @module Components.Help */

import { Divider, Layout, PageHeader, Space, Typography } from 'antd'

import Workspace from './doc/workspace'
import Project from './doc/project'
import HPC from './doc/hpc'
import Administration from './doc/administration'
import Organizations from './doc/organizations'

/**
 * Help
 * @returns Help
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
        <Space direction="vertical" className="full-width" size={20}>
          <Workspace />
          <Project />
          <HPC />
          <Organizations />
          <Administration />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

Help.propTypes = {}

export default Help
