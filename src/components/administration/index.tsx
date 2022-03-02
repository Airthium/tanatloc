/** @module Components.Administration */

import { useEffect } from 'react'
import { NextRouter, useRouter } from 'next/router'
import { Divider, Layout, PageHeader, Tabs, Typography } from 'antd'

import { ErrorNotification } from '@/components/assets/notification'

import Users from './users'
import Registration from './registration'

import UserAPI from '@/api/user'

/**
 * Tab items
 */
const tabItems = {
  users: {
    label: 'Users',
    key: 'users'
  },
  registration: {
    label: 'Registration',
    key: 'registration'
  }
}

/**
 * Errors
 */
const errors = {
  users: 'Users error'
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
    <Layout className="inDashboard Administration">
      <PageHeader
        className="inDashboard-PageHeader"
        backIcon={false}
        title={
          <Typography.Title level={2} className="inDashboard-PageHeader-title">
            Administration
          </Typography.Title>
        }
        footer={<Divider />}
      />
      <Layout.Content>
        <Tabs
          className="inDashboard-Tabs"
          type="card"
          defaultActiveKey={tab || 'default'}
          onChange={(key) => onChange(router, key)}
        >
          <Tabs.TabPane tab={tabItems.users.label} key={tabItems.users.key}>
            <Users
              users={users}
              swr={{ addOneUser, mutateOneUser, delOneUser }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={tabItems.registration.label}
            key={tabItems.registration.key}
          >
            <Registration />
          </Tabs.TabPane>
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

Administration.propTypes = {}

export default Administration
