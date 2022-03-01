/** @module Components.Dashboard */

import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { Layout, Menu, Typography } from 'antd'
import {
  AppstoreOutlined,
  ControlOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  TeamOutlined
} from '@ant-design/icons'

import packageJson from '../../../package.json'

import { Error as ErrorNotification } from '@/components/assets/notification'

import Loading from '@/components/loading'
import WorkspacesList from '@/components/workspace/list'
import Account from '@/components/account'
import Organizations from '@/components/organizations'
import Administration from '@/components/administration'
import Help from '@/components/help'

import UserAPI from '@/api/user'
import OrganizationAPI from '@/api/organization'
import WorkspaceAPI from '@/api/workspace'
import { logout } from '@/api/logout'

/**
 * Errors
 */
const errors = {
  user: 'User error',
  organizations: 'Organizations error',
  workspaces: 'Workspaces error',
  logout: 'Unable to logout'
}

/**
 * Dashboard menu items
 */
const menuItems = {
  workspaces: {
    label: 'Workspaces',
    key: 'workspaces'
  },
  account: {
    label: 'Account Settings',
    key: 'account'
  },
  organizations: {
    label: 'Organizations',
    key: 'organizations'
  },
  administration: {
    label: 'Administration',
    key: 'administration'
  },
  help: {
    label: 'I Need Help',
    key: 'help'
  },
  logout: {
    label: 'Logout',
    key: 'logout'
  }
}

/**
 * Dashboard
 */
const Dashboard = () => {
  // State
  const [currentKey, setCurrentKey]: [string, Function] = useState()

  // Data
  const [user, { mutateUser, clearUser, errorUser, loadingUser }] =
    UserAPI.useUser()
  const [
    organizations,
    {
      addOneOrganization,
      delOneOrganization,
      mutateOneOrganization,
      errorOrganizations,
      loadingOrganizations
    }
  ] = OrganizationAPI.useOrganizations()
  const [
    workspaces,
    {
      addOneWorkspace,
      delOneWorkspace,
      mutateOneWorkspace,
      errorWorkspaces,
      loadingWorkspaces
    }
  ] = WorkspaceAPI.useWorkspaces()

  // Router
  const router = useRouter()

  // Page effect, only on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const page = params.get('page')

    if (page) setCurrentKey(page)
    else setCurrentKey(menuItems.workspaces.key)
  }, [])

  // Error
  useEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser)
    if (errorOrganizations)
      ErrorNotification(errors.organizations, errorOrganizations)
    if (errorWorkspaces) ErrorNotification(errors.workspaces, errorWorkspaces)
  }, [errorUser, errorOrganizations, errorWorkspaces])

  // Not logged -> go to login page
  useEffect(() => {
    if (!loadingUser && !user) router.replace('/login')
  }, [user, loadingUser])

  /**
   * Menu selection
   * @param data
   */
  const onSelect = ({ keyPath }: { keyPath: string[] }): void => {
    let key = keyPath.pop()

    if (key === menuItems.logout.key) onLogout()
    else {
      setCurrentKey(key)
      router.replace({
        pathname: '/dashboard',
        query: { page: key }
      })
    }
  }

  /**
   * Logout
   */
  const onLogout = async (): Promise<void> => {
    try {
      await logout()
      clearUser()

      router.push('/')
    } catch (err) {
      ErrorNotification(errors.logout, err)
    }
  }

  let gitVersion = ''
  if (
    process.env.NEXT_PUBLIC_SOURCE_BRANCH &&
    process.env.NEXT_PUBLIC_SOURCE_COMMIT
  )
    gitVersion =
      'git-' +
      process.env.NEXT_PUBLIC_SOURCE_BRANCH +
      '-' +
      process.env.NEXT_PUBLIC_SOURCE_COMMIT

  /**
   * Render
   */
  if (loadingUser || loadingOrganizations || loadingWorkspaces || !user)
    return <Loading />
  else
    return (
      <Layout className="Dashboard">
        <Layout.Sider theme="light" width="256" className="Dashboard-Sider">
          <div className="logo">
            <img src="/images/logo.svg" alt="Tanatloc" />
          </div>

          <Menu
            className="Dashboard-Menu"
            theme="light"
            onClick={onSelect}
            mode="inline"
          >
            <Menu.Item
              key={menuItems.workspaces.key}
              icon={<AppstoreOutlined />}
            >
              {menuItems.workspaces.label}
            </Menu.Item>
            <Menu.Item key={menuItems.account.key} icon={<SettingOutlined />}>
              {menuItems.account.label}
            </Menu.Item>
            <Menu.Item
              key={menuItems.organizations.key}
              icon={<TeamOutlined />}
            >
              {menuItems.organizations.label}
            </Menu.Item>
            {user.superuser && (
              <Menu.Item
                key={menuItems.administration.key}
                icon={<ControlOutlined />}
              >
                {menuItems.administration.label}
              </Menu.Item>
            )}
            <Menu.Item
              key={menuItems.help.key}
              icon={<QuestionCircleOutlined />}
            >
              {menuItems.help.label}
            </Menu.Item>
            <Menu.Divider className="Dashboard-Menu-Divider" />
            <Menu.Item
              key={menuItems.logout.key}
              danger={true}
              icon={<LogoutOutlined />}
            >
              {menuItems.logout.label}
            </Menu.Item>
            <Menu.Item key="version" disabled className="version">
              <Typography.Text
                className="text-light"
                ellipsis={{ tooltip: true }}
              >
                version {packageJson.version}{' '}
                {gitVersion && <>({gitVersion})</>}
              </Typography.Text>
            </Menu.Item>
          </Menu>
        </Layout.Sider>

        <Layout.Content className="no-scroll">
          {currentKey === menuItems.workspaces.key && (
            <WorkspacesList
              user={{ id: user?.id }}
              workspaces={workspaces}
              organizations={organizations}
              swr={{ addOneWorkspace, delOneWorkspace, mutateOneWorkspace }}
            />
          )}
          {currentKey === menuItems.account.key && (
            <Account
              user={{
                email: user?.email,
                firstname: user?.firstname,
                lastname: user?.lastname,
                avatar: user?.avatar
              }}
              swr={{ mutateUser }}
            />
          )}
          {currentKey === menuItems.organizations.key && (
            <Organizations
              user={{ id: user?.id }}
              organizations={organizations}
              swr={{
                addOneOrganization,
                delOneOrganization,
                mutateOneOrganization,
                loadingOrganizations
              }}
            />
          )}
          {currentKey === menuItems.administration.key && <Administration />}
          {currentKey === menuItems.help.key && <Help />}
        </Layout.Content>
      </Layout>
    )
}

export default Dashboard
