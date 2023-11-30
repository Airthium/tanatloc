/** @module Components.Doc.Dashboard */

import { Tabs, Typography } from 'antd'
import { useRouter } from 'next/router'
import { useCallback } from 'react'

import Workspace from './workspace'
import Account from './account'
import Organizations from './organizations'
import Administration from './administration'
import Editor from './editor'
import Help from './help'

import style from '../index.module.css'

/**
 * Tabs
 */
const tabs = [
  {
    key: 'workspaces',
    label: 'Workspaces & Projects',
    children: <Workspace />
  },
  {
    key: 'account',
    label: 'Account Settings',
    children: <Account />
  },
  {
    key: 'organizations',
    label: 'Organizations',
    children: <Organizations />
  },
  {
    key: 'administration',
    label: 'Administration',
    children: <Administration />
  },
  {
    key: 'editor',
    label: 'Model Editor',
    children: <Editor />
  },
  {
    key: 'Help',
    label: 'Help',
    children: <Help />
  }
]

/**
 * Dashboard
 * @returns Dashboard
 */
const Dashboard = (): React.JSX.Element => {
  // Data
  const router = useRouter()
  const query = router.query

  /**
   * On change
   * @param key Key
   */
  const onChange = useCallback(
    (key: string): void => {
      ;(async () => {
        await router.push({
          pathname: '/doc',
          query: {
            section: 'dashboard',
            tab: key
          }
        })
      })()
    },
    [router]
  )

  /**
   * Render
   */
  return (
    <>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <Typography className={style.text}>
        <Typography.Text>
          The dashboard is the main place where you can manage your workspaces
          and projects, your account, your organizations and get help. There is
          an access to the model editor too.
        </Typography.Text>
        <Typography.Text>
          If you are an administrator, you have equally access to administration
          tools.
        </Typography.Text>
      </Typography>

      <Tabs
        defaultActiveKey={(query.tab as string) ?? 'workspaces'}
        items={tabs}
        onChange={onChange}
      />
    </>
  )
}

export default Dashboard
