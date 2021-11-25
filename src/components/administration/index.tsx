/** @module Components.Administration */

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { Divider, Layout, PageHeader, Tabs, Typography } from 'antd'

import { Error } from '@/components/assets/notification'

import Users from './users'
import Registration from './registration'

import UserAPI from '@/api/user'

/**
 * Tab items
 * @memberof Components.Administration
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
 * @memberof Components.Administration
 */
const errors = {
  users: 'Users error'
}

/**
 * Administration
 * @memberof Components.Administration
 */
const Administration = (): JSX.Element => {
  // Data
  const router = useRouter()
  const { tab }: { tab?: string } = router.query

  const [users, { addOneUser, mutateOneUser, delOneUser, errorUsers }] =
    UserAPI.useUsers()

  // Users error
  useEffect(() => {
    if (errorUsers) Error(errors.users, errorUsers)
  }, [errorUsers])

  /**
   * On change
   * @param key Key
   */
  const onChange = (key: string) => {
    router.replace({
      pathname: '/dashboard',
      query: { page: 'administration', tab: key }
    })
  }

  /**
   * Render
   */
  return (
    <Layout className="Workspace">
      <PageHeader
        backIcon={false}
        title={
          <Typography.Title level={2} className="pageheader-name">
            Administration
          </Typography.Title>
        }
        footer={
          <div>
            <Divider className="Tanatloc-divider" />
          </div>
        }
      />
      <Layout.Content>
        <Tabs defaultActiveKey={tab || 'default'} onChange={onChange}>
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

export default Administration
