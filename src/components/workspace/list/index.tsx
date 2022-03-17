/** @module Components.Workspace.List */

import PropTypes from 'prop-types'
import { NextRouter, useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import {
  Divider,
  Empty,
  Form,
  Input,
  Layout,
  PageHeader,
  Tabs,
  Typography
} from 'antd'

import {
  IOrganizationWithData,
  IUserWithData,
  IWorkspaceWithData
} from '@/lib/index.d'
import { INewWorkspace } from '@/database/index.d'

import Dialog from '@/components/assets/dialog'
import { ErrorNotification } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

import Workspace from '..'
import Add from '../add'

/**
 * Props
 */
export interface IProps {
  user: IUserWithData
  workspaces: IWorkspaceWithData[]
  organizations: IOrganizationWithData[]
  swr: {
    addOneWorkspace: (workspace: INewWorkspace) => void
    mutateOneWorkspace: (workspace: IWorkspaceWithData) => void
    delOneWorkspace: (workspace: IWorkspaceWithData) => void
  }
}

/**
 * Errors
 */
export const errors = {
  add: 'Unable to add the workspace'
}

/**
 * On confirm
 * @param router Router
 * @param values Values
 * @param swr SWR
 */
export const onOk = async (
  router: NextRouter,
  values: { name: string },
  swr: { addOneWorkspace: (workspace: INewWorkspace) => void }
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
  const [visible, setVisible]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  // Router
  const router = useRouter()
  const { page, workspaceId }: { page?: string; workspaceId?: string } =
    router.query

  /**
   * Render
   */
  return (
    <Layout className="inDashboard Workspace no-scroll">
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
      <Layout.Content className="no-scroll">
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
                    max: 50,
                    message: 'Max 50 characters'
                  }
                ]}
              >
                <Input placeholder="Workspace's name" />
              </Form.Item>
            </Dialog>
            <Tabs
              type="editable-card"
              className="inDashboard-Tabs no-scroll"
              defaultActiveKey={workspaceId || '1'}
              onEdit={() => setVisible(true)}
            >
              {workspaces.map((workspace) => (
                <Tabs.TabPane
                  className="no-scroll"
                  tab={workspace.name}
                  key={workspace.id}
                  closable={false}
                >
                  <Workspace
                    user={user}
                    page={page}
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
                </Tabs.TabPane>
              ))}
            </Tabs>
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

// TODO propTypes
WorkspacesList.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  workspaces: PropTypes.arrayOf(
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      projects: PropTypes.arrayOf(PropTypes.string).isRequired,
      owners: PropTypes.array.isRequired,
      users: PropTypes.array,
      groups: PropTypes.array
    }).isRequired
  ).isRequired,
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.exact({
    addOneWorkspace: PropTypes.func.isRequired,
    mutateOneWorkspace: PropTypes.func.isRequired,
    delOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default WorkspacesList
