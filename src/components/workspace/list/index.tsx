import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { Divider, Empty, Layout, PageHeader, Tabs, Typography } from 'antd'

import { IOrganizationWithData, IWorkspaceWithData } from '@/lib/index.d'

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
  const [add, setAdd]: [boolean, Function] = useState(false)

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
    if (action === 'add') setAdd(true)
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
            Workspaces
          </Typography.Title>
        }
        footer={<Divider />}
      />
      <Layout.Content>
        {workspaces.length ? (
          <Tabs
            type="editable-card"
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
        ) : (
          <>
            <Empty
              image="images/empty.svg"
              description={'No workspace for now. Get started !'}
            >
              <Add
                visible={add}
                swr={{
                  addOneWorkspace: swr.addOneWorkspace
                }}
                setVisible={setAdd}
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
