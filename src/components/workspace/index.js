/** @module 'src/components/workspace */

import { useState } from 'react'
import {
  Divider,
  Layout,
  PageHeader,
  Row,
  Col,
  Input,
  Avatar,
  Tooltip,
  Typography
} from 'antd'

import { Error } from '@/components/assets/notification'

import Empty from './empty'
import Share from './share'
import Delete from './delete'

import ProjectAdd from '@/components/project/add'
import ProjectList from '@/components/project/list'

import Utils from '@/lib/utils'

import WorkspaceAPI from '@/api/workspace'

const errors = {
  updateError: 'Unable to update the workspace'
}

/**
 * Workspace
 * @param {Object} props Props
 */
const Workspace = ({ workspace }) => {
  // State
  const [filter, setFilter] = useState()

  // Data
  const [, { mutateOneWorkspace }] = WorkspaceAPI.useWorkspaces()

  /**
   * Set name
   * @param {string} name Name
   */
  const setName = async (name) => {
    try {
      // Update
      await WorkspaceAPI.update({ id: workspace.id }, [
        { key: 'name', value: name }
      ])

      // Mutate workspace
      mutateOneWorkspace({
        ...workspace,
        name
      })
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * On search
   * @param {Object} e Event
   */
  const onSearch = (e) => {
    setFilter(e.target.value)
  }

  /**
   * Render
   */
  return (
    <Layout className="Workspace">
      {workspace ? (
        <>
          <PageHeader
            backIcon={false}
            title={
              <Typography.Title
                level={2}
                className="pageheader-name"
                editable={{ onChange: setName }}
              >
                {workspace.name}
              </Typography.Title>
            }
            extra={[
              <Share key="share" workspace={workspace} />,
              <Delete key="delete" workspace={workspace} />
            ]}
            footer={
              <>
                <Divider className="Tanatloc-divider" />
                <Row gutter={[16, 16]} justify="center">
                  <Col span={12}>
                    <Input
                      addonBefore="Search"
                      placeholder="Enter a project name (case sensitive)"
                      value={filter}
                      onChange={onSearch}
                    />
                  </Col>
                  <Col>
                    <ProjectAdd workspace={workspace} />
                  </Col>
                </Row>
              </>
            }
          >
            {workspace.users?.length || workspace.groups?.length ? (
              <div className="Workspace-share">
                <span style={{ marginRight: '10px' }}>
                  This workspace is shared with:
                </span>
                <Avatar.Group>
                  {workspace.users?.map((user) => {
                    return (
                      <Tooltip key={user} title={user} placement="bottom">
                        <Avatar style={{ backgroundColor: '#023E8A' }}>
                          {user}
                        </Avatar>
                      </Tooltip>
                    )
                  })}
                </Avatar.Group>
                <Avatar.Group>
                  {workspace.groups?.map((group) => {
                    return (
                      <Tooltip
                        key={group}
                        title={group.name}
                        placement="bottom"
                      >
                        <Avatar
                          style={{
                            backgroundColor: Utils.stringToColor(group.name)
                          }}
                        >
                          {group.name?.[0]?.toUpperCase()}
                        </Avatar>
                      </Tooltip>
                    )
                  })}
                </Avatar.Group>
              </div>
            ) : null}
          </PageHeader>
          <Layout.Content>
            <ProjectList workspace={workspace} filter={filter} />
          </Layout.Content>
        </>
      ) : (
        <Empty />
      )}
    </Layout>
  )
}

export default Workspace
