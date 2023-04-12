/** @module Components.Dashboard */

import { useRouter } from 'next/router'
import { useCallback, useState } from 'react'
import { Layout, Menu, Typography } from 'antd'
import {
  AppstoreOutlined,
  ControlOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  LogoutOutlined,
  TeamOutlined,
  EditOutlined
} from '@ant-design/icons'
import isElectron from 'is-electron'

import packageJson from '../../../package.json'

import useCustomEffect from '@/components/utils/useCustomEffect'

import { ErrorNotification } from '@/components/assets/notification'

import Loading from '@/components/loading'
import WorkspacesList from '@/components/workspace/list'
import Account from '@/components/account'
import Organizations from '@/components/organizations'
import Administration from '@/components/administration'
import Help from '@/components/help'
import Updater from '@/components/dashboard/updater'

import UserAPI from '@/api/user'
import OrganizationAPI from '@/api/organization'
import WorkspaceAPI from '@/api/workspace'
import { logout } from '@/api/logout'

import style from './index.module.css'
import globalStyle from '@/styles/index.module.css'

/**
 * Errors
 */
export const errors = {
  user: 'Error while loading user',
  organizations: 'Error while loading organizations',
  workspaces: 'Error while loading workspaces',
  logout: 'Unable to logout'
}

/**
 * Dashboard menu items
 */
export const menuItems = {
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
  editor: {
    label: 'Model Editor',
    key: 'editor'
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
  const [currentKey, setCurrentKey] = useState<string>()

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

  /**
   * On logout
   */
  const onLogout = useCallback(async () => {
    try {
      await logout()
      clearUser()
      router.push('/')
    } catch (err) {
      ErrorNotification(errors.logout, err)
    }
  }, [router, clearUser])

  /**
   * On select
   * @param key Key
   */
  const onSelect = useCallback(
    (key: string): void => {
      setCurrentKey(key)

      if (key === menuItems.logout.key) onLogout()
      else if (key === menuItems.editor.key) router.push('/editor')
      else {
        router.replace({
          pathname: '/dashboard',
          query: { page: key }
        })
      }
    },
    [router, onLogout]
  )

  /**
   * On menu click
   * @param param Keypath
   */
  const onMenuClick = useCallback(
    ({ keyPath }: { keyPath: string[] }): void => {
      const key = keyPath.pop()
      onSelect(key!)
    },
    [onSelect]
  )

  // Not logged -> go to login page
  useCustomEffect(() => {
    if (!loadingUser && !user) router.replace('/')
  }, [user, loadingUser, router])

  // Page effect, only on mount
  useCustomEffect(
    () => {
      const params = new URLSearchParams(window.location.search)
      const page = params.get('page')

      if (page) setCurrentKey(page)
      else {
        onSelect(menuItems.workspaces.key)
      }
    },
    [router],
    [onSelect]
  )

  // Error
  useCustomEffect(() => {
    if (errorUser) ErrorNotification(errors.user, errorUser)
    if (errorOrganizations)
      ErrorNotification(errors.organizations, errorOrganizations)
    if (errorWorkspaces) ErrorNotification(errors.workspaces, errorWorkspaces)
  }, [errorUser, errorOrganizations, errorWorkspaces])

  /**
   * Render
   */
  if (!user || loadingUser || loadingOrganizations || loadingWorkspaces)
    return <Loading />

  return (
    <Layout className={style.dashboard}>
      <Updater />
      <Layout.Sider theme="light" width="256" className={style.sider}>
        <div className={globalStyle.logo}>
          <img src="/images/logo.svg" alt="Tanatloc" />
        </div>

        <Menu
          className={style.menu}
          items={[
            {
              key: menuItems.workspaces.key,
              icon: <AppstoreOutlined />,
              label: menuItems.workspaces.label
            },
            {
              key: menuItems.account.key,
              icon: <SettingOutlined />,
              label: menuItems.account.label
            },
            {
              key: menuItems.organizations.key,
              icon: <TeamOutlined />,
              label: menuItems.organizations.label,
              className: isElectron() ? 'display-none' : ''
            },
            {
              key: menuItems.administration.key,
              className: user.superuser && !isElectron() ? '' : 'display-none',
              icon: <ControlOutlined />,
              label: menuItems.administration.label
            },
            {
              key: menuItems.editor.key,
              icon: <EditOutlined />,
              label: menuItems.editor.label
            },
            {
              key: menuItems.help.key,
              icon: <QuestionCircleOutlined />,
              label: menuItems.help.label
            },
            { type: 'divider' },
            {
              key: menuItems.logout.key,
              danger: true,
              icon: <LogoutOutlined />,
              label: menuItems.logout.label,
              className: isElectron() ? 'display-none' : ''
            },
            {
              key: 'version',
              disabled: true,
              className: 'version',
              label: (
                <Typography.Text
                  className={globalStyle.textLight}
                  ellipsis={{ tooltip: true }}
                >
                  version {packageJson.version}
                </Typography.Text>
              )
            }
          ]}
          onClick={onMenuClick}
          mode="inline"
        />
      </Layout.Sider>

      <Layout.Content className={globalStyle.noScroll}>
        {currentKey === menuItems.workspaces.key && (
          <WorkspacesList
            user={{ id: user.id }}
            workspaces={workspaces}
            organizations={organizations}
            swr={{ addOneWorkspace, delOneWorkspace, mutateOneWorkspace }}
          />
        )}
        {currentKey === menuItems.account.key && (
          <Account
            user={{
              email: user.email,
              firstname: user.firstname,
              lastname: user.lastname,
              avatar: user.avatar
            }}
            swr={{ mutateUser, clearUser }}
          />
        )}
        {currentKey === menuItems.organizations.key && (
          <Organizations
            user={{ id: user.id }}
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
