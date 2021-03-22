/** @module components/workspace */

import PropTypes from 'prop-types'
import { useState } from 'react'
import {
  Avatar,
  Divider,
  Input,
  Layout,
  PageHeader,
  Space,
  Typography
} from 'antd'

import { Error } from '@/components/assets/notification'

import Share from './share'
import Delete from './delete'

import ProjectAdd from '@/components/project/add'
import ProjectList from '@/components/project/list'

import Utils from '@/lib/utils'

import WorkspaceAPI from '@/api/workspace'

/**
 * Errors
 */
const errors = {
  updateError: 'Unable to update the workspace'
}

/**
 * Workspace
 * @param {Object} props Props
 */
const Workspace = ({ user, workspace, swr }) => {
  // State
  const [filter, setFilter] = useState()

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
      swr.mutateOneWorkspace({
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
      <>
        <PageHeader
          backIcon={false}
          title={
            <Typography.Title
              level={2}
              className="pageheader-name"
              editable={workspace.id && { onChange: setName }}
            >
              {workspace.name}
            </Typography.Title>
          }
          extra={
            workspace.id
              ? [
                  <Share key="share" workspace={workspace} />,
                  workspace?.owners?.find((o) => o.id === user?.id) && (
                    <Delete key="delete" workspace={workspace} />
                  )
                ]
              : null
          }
          footer={
            <>
              <Divider className="Tanatloc-divider" />
              <Space direction="" align="center">
                <Input
                  addonBefore="Search"
                  placeholder="Enter a project name (case sensitive)"
                  value={filter}
                  onChange={onSearch}
                />
                <ProjectAdd workspace={workspace} />
              </Space>
            </>
          }
        >
          {workspace.users?.length || workspace.groups?.length ? (
            <div className="Workspace-share">
              <span style={{ marginRight: '10px' }}>
                This workspace is shared with:
              </span>
              <Avatar.Group maxCount={5}>
                {workspace.users?.map((u) => Utils.userToAvatar(u))}
              </Avatar.Group>
              <Avatar.Group maxCount={5}>
                {workspace.groups?.map((g) => Utils.groupToAvatar(g))}
              </Avatar.Group>
            </div>
          ) : null}
        </PageHeader>
        <Layout.Content>
          <ProjectList user={user} workspace={workspace} filter={filter} />
        </Layout.Content>
      </>
    </Layout>
  )
}

Workspace.propTypes = {
  user: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  swr: PropTypes.object.isRequired
}

export default Workspace
