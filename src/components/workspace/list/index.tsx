import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useState } from 'react'
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

import { IOrganizationWithData, IWorkspaceWithData } from '@/lib/index.d'

import Dialog from '@/components/assets/dialog'
import { Error as ErrorNotification } from '@/components/assets/notification'

import WorkspaceAPI from '@/api/workspace'

import Workspace from '..'
import Add from '../add'

export interface IProps {
  user: {}
  workspaces: IWorkspaceWithData[]
  organizations: IOrganizationWithData[]
  swr: {
    addOneWorkspace: Function
    mutateOneWorkspace: Function
    delOneWorkspace: Function
  }
}

/**
 * Errors (add)
 * @memberof Components.Workspace
 */
const errors = {
  add: 'Unable to add the workspace'
}

/**
 * Workspace list
 * @memberof Components.Workspace
 * @param props Props
 */
const WorkspacesList = ({
  user,
  workspaces,
  organizations,
  swr
}: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  // Router
  const router = useRouter()
  const { page, workspaceId }: { page?: string; workspaceId?: string } =
    router.query

  /**
   * On tab edit
   * @param _ Unused
   * @param action Action
   */
  const onEdit = (_: {}, action: string): void => {
    /* istanbul ignore next */
    if (action === 'add') setVisible(true)
  }

  /**
   * On confirm
   * @param values Values
   */
  const onOk = async (values: { name: string }): Promise<void> => {
    setLoading(true)
    try {
      // Add
      const workspace = await WorkspaceAPI.add(values)

      // Mutate
      swr.addOneWorkspace(workspace)

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      ErrorNotification(errors.add, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <Layout className="inDashboard Workspace">
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
      <Layout.Content>
        {workspaces.length ? (
          <>
            <Dialog
              visible={visible}
              loading={loading}
              title="Create a new workspace"
              onCancel={() => setVisible(false)}
              onOk={onOk}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  { required: true, message: 'A Workspace name is required' },
                  {
                    max: 50,
                    message: 'A workspace name must not exceed 50 characters'
                  }
                ]}
              >
                <Input placeholder="Workspace's name" />
              </Form.Item>
            </Dialog>
            <Tabs
              type="editable-card"
              className="inDashboard-Tabs"
              defaultActiveKey={workspaceId || '1'}
              onEdit={onEdit}
            >
              {workspaces.map((workspace) => (
                <Tabs.TabPane
                  tab={workspace.name}
                  key={workspace.id}
                  closable={false}
                >
                  <Workspace
                    loading={!workspace}
                    user={user}
                    page={page}
                    workspace={workspace}
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

WorkspacesList.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  workspaces: PropTypes.array.isRequired,
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.exact({
    addOneWorkspace: PropTypes.func.isRequired,
    mutateOneWorkspace: PropTypes.func.isRequired,
    delOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default WorkspacesList
