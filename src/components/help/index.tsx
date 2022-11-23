/** @module Components.Help */

import { Layout, Space, Typography } from 'antd'

import PageHeader from '@/components/assets/pageHeader'

import Workflow from './doc/workflow'
import Workspace from './doc/workspace'
import Project from './doc/project'
import HPC from './doc/hpc'
import Administration from './doc/administration'
import Organizations from './doc/organizations'
import About from './doc/about'

import dashboardStyle from '@/components/dashboard/index.style'
import { css } from '@emotion/react'
import { globalStyle } from '@/styles'

/**
 * Help
 * @returns Help
 */
const Help = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout css={dashboardStyle.inDashboard} className="inDashboard Help">
      <PageHeader
        title={
          <Typography.Title
            level={2}
            css={css({ marginBottom: '0 !important' })}
          >
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
      />
      <Layout.Content css={globalStyle.scroll}>
        <Space direction="vertical" css={globalStyle.fullWidth} size={20}>
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
