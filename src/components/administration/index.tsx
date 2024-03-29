/** @module Components.Administration */

import { useCallback, useContext, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Layout, Tabs, Typography } from 'antd'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import { asyncFunctionExec } from '@/components/utils/asyncFunction'
import PageHeader from '@/components/assets/pageHeader'

import UserAPI from '@/api/user'

import Users from './users'
import Registration from './registration'
import Plugins from './plugins'

import dashboardStyle from '@/components/dashboard/index.module.css'

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
 * Administration
 * @returns Administration
 */
const Administration: React.FunctionComponent = () => {
  // Context
  const { dispatch } = useContext(NotificationContext)

  // Data
  const router = useRouter()
  const { tab }: { tab?: string } = router.query

  const [users, { addOneUser, mutateOneUser, delOneUser, errorUsers }] =
    UserAPI.useUsers()

  // Users error
  useEffect(() => {
    if (errorUsers) dispatch(addError({ title: errors.users, err: errorUsers }))
  }, [errorUsers, dispatch])

  /**
   * On change
   * @param key Key
   */
  const onChange = useCallback(
    (key: string): void => {
      asyncFunctionExec(async () => {
        await router.replace({
          pathname: '/dashboard',
          query: { page: 'administration', tab: key }
        })
      })
    },
    [router]
  )

  /**
   * Render
   */
  return (
    <Layout className={dashboardStyle.inDashboard}>
      <PageHeader
        title={
          <Typography.Title
            level={2}
            style={{
              marginBottom: '0 !important'
            }}
          >
            Administration
          </Typography.Title>
        }
      />
      <Layout.Content>
        <Tabs
          className={dashboardStyle.inDashboardTabs}
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
          defaultActiveKey={tab ?? 'default'}
          onChange={onChange}
        />
      </Layout.Content>
    </Layout>
  )
}

export default Administration
