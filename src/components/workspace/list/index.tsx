/** @module Components.Workspace.List */

import { NextRouter, useRouter } from 'next/router'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Empty, Form, Input, InputRef, Layout, Tabs, Typography } from 'antd'

import {
  IFrontMutateWorkspacesItem,
  IFrontNewWorkspace,
  IFrontOrganizationsItem,
  IFrontUser,
  IFrontWorkspacesItem
} from '@/api/index.d'

import { LIMIT50 } from '@/config/string'

import { menuItems } from '@/components/dashboard'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'
import PageHeader from '@/components/assets/pageHeader'

import WorkspaceAPI from '@/api/workspace'

import Add from '../add'
import Workspace from '..'

import dashboardStyle from '@/components/dashboard/index.module.css'
import globalStyle from '@/styles/index.module.css'
import AddExample from '../example'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id'>
  workspaces: Pick<
    IFrontWorkspacesItem,
    'id' | 'name' | 'projects' | 'owners' | 'users' | 'groups'
  >[]
  organizations: Pick<
    IFrontOrganizationsItem,
    'id' | 'name' | 'owners' | 'users' | 'groups'
  >[]
  swr: {
    addOneWorkspace: (workspace: IFrontNewWorkspace) => Promise<void>
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  }
}

/**
 * Errors
 */
export const errors = {
  add: 'Unable to add workspace'
}

/**
 * On confirm
 * @param router Router
 * @param values Values
 * @param swr SWR
 */
export const _onOk = async (
  router: NextRouter,
  values: Pick<IFrontWorkspacesItem, 'name'>,
  swr: { addOneWorkspace: (workspace: IFrontNewWorkspace) => Promise<void> }
): Promise<void> => {
  try {
    // Add
    const workspace = await WorkspaceAPI.add(values)

    // Mutate
    await swr.addOneWorkspace(workspace)

    await router
      .push({
        pathname: '/dashboard',
        query: { page: 'workspaces', workspaceId: workspace.id }
      })
      .catch()
  } catch (err: any) {
    ErrorNotification(errors.add, err)
    throw err
  }
}

/**
 * Workspace list
 * @param props Props
 * @returns WorkspaceList
 */
const WorkspacesList = ({
  user,
  workspaces,
  organizations,
  swr
}: IProps): React.JSX.Element => {
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Router
  const router = useRouter()
  const { page, workspaceId }: { page?: string; workspaceId?: string } =
    router.query

  // Autofocus
  useEffect(() => {
    /* istanbul ignore next */
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => {
    setVisible(true)
  }, [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => {
    setVisible(false)
  }, [])

  /**
   * On change
   * @param activeKey Active key
   */
  const onChange = useCallback(
    (activeKey: string): void => {
      ;(async () => {
        await router.push({
          pathname: '/dashboard',
          query: { page: 'workspaces', workspaceId: activeKey }
        })
      })()
    },
    [router]
  )

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: Pick<IFrontWorkspacesItem, 'name'>): Promise<void> => {
      setLoading(true)
      try {
        await _onOk(router, values, swr)

        // Close
        setLoading(false)
        setVisible(false)
      } catch (err) {
        setLoading(false)
        throw err
      }
    },
    [router, swr]
  )

  /**
   * Render
   */
  return (
    <Layout className={`${dashboardStyle.inDashboard} ${globalStyle.noScroll}`}>
      <PageHeader
        title={
          <Typography.Title level={2} style={{ marginBottom: '0 !important' }}>
            Workspaces
          </Typography.Title>
        }
      />
      <Layout.Content className={globalStyle.noScroll}>
        {workspaces.length ? (
          <>
            <Dialog
              visible={visible}
              loading={loading}
              title="Create a new workspace"
              onCancel={setVisibleFalse}
              onOk={onOk}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: 'Name is required' },
                  {
                    max: LIMIT50,
                    message: 'Max ' + LIMIT50 + ' characters'
                  }
                ]}
              >
                <Input ref={inputRef} placeholder="Workspace's name" />
              </Form.Item>
            </Dialog>
            <AddExample/>
            <Tabs
              type="editable-card"
              className={`${globalStyle.noScroll} ${dashboardStyle.inDashboardTabs}`}
              items={workspaces.map((workspace) => ({
                key: workspace.id,
                label: workspace.name,
                css: globalStyle.noScroll,
                closable: false,
                children: (
                  <Workspace
                    user={user}
                    page={page ?? menuItems.workspaces.key}
                    workspace={{
                      id: workspace.id,
                      name: workspace.name,
                      projects: workspace.projects,
                      owners: workspace.owners,
                      users: workspace.users,
                      groups: workspace.groups
                    }}
                    organizations={organizations}
                    swr={{
                      delOneWorkspace: swr.delOneWorkspace,
                      mutateOneWorkspace: swr.mutateOneWorkspace
                    }}
                  />
                )
              }))}
              defaultActiveKey={'1'}
              activeKey={workspaceId}
              onChange={onChange}
              onEdit={setVisibleTrue}
            />
            
            
          </>
        ) : (
          <>
            <Empty
              image="images/empty.svg"
              description={'No workspace for now. Get started !'}
            >
              <Add
                swr={{
                  addOneWorkspace: swr.addOneWorkspace
                }}
              />
            </Empty>
          </>
        )}
      </Layout.Content>
    </Layout>
  )
}

export default WorkspacesList
