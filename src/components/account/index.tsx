/** @module Components.Account */

import { useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { Layout, Typography, Tabs, Space, TabsProps } from 'antd'
import isElectron from 'is-electron'

import { IFrontUser, IFrontMutateUser } from '@/api/index.d'

import PageHeader from '@/components/assets/pageHeader'

import Information from './information'
import Password from './password'
import Delete from './delete'
import HPC from './hpc'

import dashboardStyle from '@/components/dashboard/index.module.css'
import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'email' | 'firstname' | 'lastname' | 'avatar'>
  swr: {
    mutateUser: (user: IFrontMutateUser) => Promise<void>
    clearUser: () => Promise<void>
  }
}

/**
 * Account
 * @param props Props
 * @returns Account
 */
const Account = ({ user, swr }: IProps): React.JSX.Element => {
  // Data
  const router = useRouter()
  const { tab }: { tab?: string } = router.query

  const tabItems = useMemo(
    () =>
      [
        {
          key: 'personal',
          label: 'Personal Information',
          children: (
            <Space
              direction="vertical"
              className={globalStyle.fullWidth}
              size={20}
            >
              <Information
                user={{
                  email: user.email,
                  firstname: user.firstname,
                  lastname: user.lastname,
                  avatar: user.avatar
                }}
                swr={{ mutateUser: swr.mutateUser }}
              />
              {!isElectron() && <Delete swr={{ clearUser: swr.clearUser }} />}
            </Space>
          )
        },
        isElectron()
          ? null
          : {
              key: 'security',
              label: 'Security',
              children: (
                <Space
                  direction="vertical"
                  className={globalStyle.fullWidth}
                  size={20}
                >
                  <Password
                    user={{
                      email: user.email
                    }}
                  />
                </Space>
              )
            },
        {
          key: 'hpc',
          label: 'HPC Providers',
          children: <HPC />
        }
      ].filter((t) => t),
    [user, swr]
  ) as TabsProps['items']

  /**
   * On change
   * @param key Key
   */
  const onChange = useCallback(
    (key: string): void => {
      ;(async () => {
        await router.replace({
          pathname: '/dashboard',
          query: { page: 'account', tab: key }
        })
      })()
    },
    [router]
  )

  /**
   * Render
   */
  return (
    <Layout className={`${globalStyle.noScroll} ${dashboardStyle.inDashboard}`}>
      <PageHeader
        title={
          <Typography.Title level={2} style={{ marginBottom: '0 !important' }}>
            Account Settings
          </Typography.Title>
        }
      />
      <Layout.Content className={globalStyle.noScroll}>
        <Tabs
          className={`${globalStyle.noScroll} ${dashboardStyle.inDashboardTabs}`}
          type="card"
          items={tabItems}
          defaultActiveKey={tab ?? 'personal'}
          onChange={onChange}
        />
      </Layout.Content>
    </Layout>
  )
}

export default Account
