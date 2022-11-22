/** @module Components.Help */

import { Divider, Layout, Space, Typography } from 'antd'
const PageHeader = () => <div />

import Workflow from './doc/workflow'
import Workspace from './doc/workspace'
import Project from './doc/project'
import HPC from './doc/hpc'
import Administration from './doc/administration'
import Organizations from './doc/organizations'
import About from './doc/about'

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
        extra={
          <a
            href="https://github.com/Airthium/tanatloc/issues/new/choose"
            target="_blank"
            rel="noreferrer"
          >
            Open an issue
          </a>
        }
        footer={<Divider />}
      />
      <Layout.Content className="scroll">
        <Space direction="vertical" className="full-width" size={20}>
          <Workflow />
          <Workspace />
          <Project />
          <HPC />
          <Organizations />
          <Administration />
          <About />
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Help
