/** @module Components.Administration */

import { useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Layout, Tabs, Typography } from 'antd'

import { ErrorNotification } from '@/components/assets/notification'
import PageHeader from '@/components/assets/pageHeader'

import Users from './users'
import Registration from './registration'
import Plugins from './plugins'

import UserAPI from '@/api/user'

import dashboardStyle from '@/components/dashboard/index.style'
import { css } from '@emotion/react'

/**
 * Tab items
 */
export const tabItems = {
  users: {
    label: 'Users',
    key: 'users'
  },
  registration: {
    label: 'Registration',
    key: 'registration'
  },
  plugins: {
    label: 'Plugins',
    key: 'plugins'
  }
}

/**
 * Errors
 */
export const errors = {
  users: 'Error while loading users'
}

/**
 * On change
 * @param router Router
 * @param key Key
 */
export const onChange = (router: NextRouter, key: string) => {
  router.replace({
    pathname: '/dashboard',
    query: { page: 'administration', tab: key }
  })
}

/**
 * Administration
 * @returns Administration
 */
const Administration = (): JSX.Element => {
  // Data
  const router = useRouter()
  const { tab }: { tab?: string } = router.query

  const [users, { addOneUser, mutateOneUser, delOneUser, errorUsers }] =
    UserAPI.useUsers()

  // Users error
  useEffect(() => {
    if (errorUsers) ErrorNotification(errors.users, errorUsers)
  }, [errorUsers])

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
            Administration
          </Typography.Title>
        }
      />
      <Layout.Content>
        <Tabs
          css={dashboardStyle.inDashboardTabs}
          type="card"
          items={[
            {
              key: tabItems.users.key,
              label: tabItems.users.label,
              children: (
                <Users
                  users={users}
                  swr={{ addOneUser, mutateOneUser, delOneUser }}
                />
              )
            },
            {
              key: tabItems.registration.key,
              label: tabItems.registration.label,
              children: <Registration />
            },
            {
              key: tabItems.plugins.key,
              label: tabItems.plugins.label,
              children: <Plugins />
            }
          ]}
          defaultActiveKey={tab || 'default'}
          onChange={(key) => onChange(router, key)}
        />
      </Layout.Content>
    </Layout>
  )
}

export default Administration
