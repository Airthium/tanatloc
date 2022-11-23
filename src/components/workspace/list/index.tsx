/** @module Components.Workspace.List */

import { NextRouter, useRouter } from 'next/router'
import { useState } from 'react'
import { Divider, Empty, Form, Input, Layout, Tabs, Typography } from 'antd'
// const PageHeader = () => <div />

import { LIMIT } from '@/config/string'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import {
  IFrontMutateWorkspacesItem,
  IFrontNewWorkspace,
  IFrontOrganizationsItem,
  IFrontUser,
  IFrontWorkspacesItem
} from '@/api/index.d'
import WorkspaceAPI from '@/api/workspace'

import Workspace from '..'
import Add from '../add'
import { menuItems } from '@/components/dashboard'

import dashboardStyle from '@/components/dashboard/index.style'
import { css } from '@emotion/react'
import { globalStyle } from '@/styles'

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
    addOneWorkspace: (workspace: IFrontNewWorkspace) => void
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
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
export const onOk = async (
  router: NextRouter,
  values: Pick<IFrontWorkspacesItem, 'name'>,
  swr: { addOneWorkspace: (workspace: IFrontNewWorkspace) => void }
): Promise<void> => {
  try {
    // Add
    const workspace = await WorkspaceAPI.add(values)

    // Mutate
    swr.addOneWorkspace(workspace)

    router.push({
      pathname: '/dashboard',
      query: { page: 'workspaces', workspaceId: workspace.id }
    })
  } catch (err) {
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
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  // Router
  const router = useRouter()
  const { page, workspaceId }: { page?: string; workspaceId?: string } =
    router.query

  /**
   * Render
   */
  return (
    <Layout css={css([dashboardStyle.inDashboard, globalStyle.noScroll])}>
      <PageHeader
        className="inDashboard-PageHeader"
        backIcon={false}
        title={
          <Typography.Title level={2} className="inDashboard-PageHeader-title">
            Workspaces
          </Typography.Title>
        }
        footer={<Divider />}
      />
      <Layout.Content css={globalStyle.noScroll}>
        {workspaces.length ? (
          <>
            <Dialog
              visible={visible}
              loading={loading}
              title="Create a new workspace"
              onCancel={() => setVisible(false)}
              onOk={async (values) => {
                setLoading(true)
                try {
                  await onOk(router, values, swr)

                  // Close
                  setLoading(false)
                  setVisible(false)
                } catch (err) {
                  setLoading(false)
                  throw err
                }
              }}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: 'Name is required' },
                  {
                    max: LIMIT,
                    message: 'Max ' + LIMIT + ' characters'
                  }
                ]}
              >
                <Input placeholder="Workspace's name" />
              </Form.Item>
            </Dialog>
            <Tabs
              type="editable-card"
              css={css([globalStyle.noScroll, dashboardStyle.inDashboardTabs])}
              items={workspaces.map((workspace) => ({
                key: workspace.id,
                label: workspace.name,
                css: globalStyle.noScroll,
                closable: false,
                children: (
                  <Workspace
                    user={user}
                    page={page || menuItems.workspaces.key}
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
              defaultActiveKey={workspaceId || '1'}
              onEdit={() => setVisible(true)}
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
