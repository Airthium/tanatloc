import { Divider, Layout, PageHeader, Tabs, Typography } from 'antd'

import Workspace from '..'

const WorkspacesList = ({ user, workspaces, organizations, swr }) => {
  console.log(workspaces)
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
        footer={<Divider className="Tanatloc-divider" />}
      ></PageHeader>
      <Layout.Content>
        <Tabs defaultActiveKey="1">
          {workspaces.map((workspace) => (
            <Tabs.TabPane tab={workspace.name} key={workspace.id}>
              <Workspace
                loading={!workspace}
                user={user}
                workspace={workspace}
                organizations={organizations}
                swr={swr}
              />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </Layout.Content>
    </Layout>
  )
}

export default WorkspacesList
