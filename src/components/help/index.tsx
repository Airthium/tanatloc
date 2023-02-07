/** @module Components.Help */

import { Layout, Space, Typography } from 'antd'

import PageHeader from '@/components/assets/pageHeader'

import dashboardStyle from '@/components/dashboard/index.style'
import { css } from '@emotion/react'
import { globalStyle } from '@/styles'
import Link from 'next/link'

/**
 * Help
 * @returns Help
 */
const Help = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <Layout css={dashboardStyle.inDashboard}>
      <PageHeader
        title={
          <Typography.Title
            level={2}
            css={css({ marginBottom: '0 !important' })}
          >
            Help
          </Typography.Title>
        }
      />
      <Layout.Content css={globalStyle.scroll}>
        <Space direction="vertical" css={globalStyle.fullWidth} size={20}>
          <Typography>
            <Typography.Title level={3}>Documentation</Typography.Title>
            <Typography.Text>
              Full interface{' '}
              <Link href="/doc" target="_blank">
                Documentation
              </Link>
            </Typography.Text>
          </Typography>
          <Typography>
            <Typography.Title level={3}>Bug report</Typography.Title>
            <Typography.Text>
              <Link
                href="https://github.com/Airthium/tanatloc/issues/new/choose"
                target="_blank"
              >
                Open an issue
              </Link>{' '}
              on Github
            </Typography.Text>
          </Typography>
          <Typography>
            <Typography.Title level={3}>Feature request</Typography.Title>
            <Typography.Text>
              <Link
                href="https://github.com/Airthium/tanatloc/issues/new/choose"
                target="_blank"
              >
                Open an issue
              </Link>{' '}
              on Github
            </Typography.Text>
          </Typography>
        </Space>
      </Layout.Content>
    </Layout>
  )
}

export default Help
