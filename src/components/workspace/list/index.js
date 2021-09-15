import PropTypes from 'prop-types'
import { useState } from 'react'
import { Divider, Layout, PageHeader, Tabs, Typography } from 'antd'

import Workspace from '..'
import Add from '../add'

const WorkspacesList = ({ user, workspaces, organizations, swr }) => {
  // State
  const [add, setAdd] = useState(false)

  /**
   * On tab edit
   * @param {Object} _ Unused
   * @param {string} action Action
   */
  const onEdit = (_, action) => {
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
        footer={<Divider className="Tanatloc-divider" />}
      />
      <Layout.Content>
        <Add visible={add} swr={swr} setVisible={setAdd} />
        <Tabs type="editable-card" defaultActiveKey="1" onEdit={onEdit}>
          {workspaces.map((workspace) => (
            <Tabs.TabPane
              tab={workspace.name}
              key={workspace.id}
              closable={false}
            >
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

WorkspacesList.propTypes = {
  user: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  workspaces: PropTypes.array.isRequired,
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.exact({
    addOneWorkspace: PropTypes.func.isRequired,
    delOneWorkspace: PropTypes.func.isRequired,
    mutateOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default WorkspacesList
