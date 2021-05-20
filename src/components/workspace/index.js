/** @module components/workspace */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import {
  Avatar,
  Divider,
  Input,
  Layout,
  PageHeader,
  Space,
  Spin,
  Typography
} from 'antd'

import Share from '@/components/assets/share'
import { Error as ErrorNotification } from '@/components/assets/notification'

import Delete from './delete'

import ProjectAdd from '@/components/project/add'
import ProjectList from '@/components/project/list'

import Utils from '@/lib/utils'

import WorkspaceAPI from '@/api/workspace'
import ProjectAPI from '@/api/project'

/**
 * Errors
 */
const errors = {
  projects: 'Projects error',
  updateError: 'Unable to update the workspace'
}

/**
 * Workspace
 * @param {Object} props Props
 */
const Workspace = ({ loading, user, workspace, organizations, swr }) => {
  // State
  const [filter, setFilter] = useState()

  // Data
  const [
    projects,
    {
      addOneProject,
      delOneProject,
      mutateOneProject,
      errorProjects,
      loadingProjects
    }
  ] = ProjectAPI.useProjects(workspace?.projects)

  // Projects error
  useEffect(() => {
    if (errorProjects) ErrorNotification(errors.projects, errorProjects)
  }, [errorProjects])

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
      ErrorNotification(errors.updateError, err)
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
  return loading ? (
    <Spin />
  ) : (
    <Layout className="Workspace">
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
          workspace.id && (
            <Space direction="">
              <Share
                workspace={workspace}
                organizations={organizations}
                swr={{ mutateOneWorkspace: swr.mutateOneWorkspace }}
              />
              {workspace?.owners?.find((o) => o.id === user.id) && (
                <Delete
                  workspace={workspace}
                  swr={{ delOneWorkspace: swr.delOneWorkspace }}
                />
              )}
            </Space>
          )
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
              <ProjectAdd
                workspace={workspace}
                swr={{
                  mutateOneWorkspace: swr.mutateOneWorkspace,
                  addOneProject
                }}
              />
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
      <Layout.Content className="scroll">
        <ProjectList
          user={user}
          workspace={workspace}
          projects={projects}
          organizations={organizations}
          filter={filter}
          swr={{
            mutateOneWorkspace: swr.mutateOneWorkspace,
            delOneProject,
            mutateOneProject,
            loadingProjects
          }}
        />
      </Layout.Content>
    </Layout>
  )
}

Workspace.propTypes = {
  loading: PropTypes.bool.isRequired,
  user: (props, propName, componentName) => {
    // Loading
    if (props['loading']) return

    // Missing user
    if (!props[propName])
      return new Error(
        'Missing prop ' + propName + ' supplied to ' + componentName + '.'
      )

    // Missing id
    if (!props[propName].id)
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. Missing id'
      )

    // Invalid id
    if (typeof props[propName].id !== 'string')
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. Invalid id'
      )
  },
  workspace: (props, propName, componentName) => {
    // Loading
    if (props['loading']) return

    // Missing workspace
    if (!props[propName])
      return new Error(
        'Missing prop ' + propName + ' supplied to ' + componentName + '.'
      )

    // Missing id
    if (!props[propName].id)
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. Missing id'
      )

    // Invalid id
    if (typeof props[propName].id !== 'string')
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. Invalid id'
      )

    // Missing projects
    if (!props[propName].projects)
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. Missing projects'
      )

    // Invalid projects
    if (typeof props[propName].projects !== 'object')
      return new Error(
        'Invalid prop ' +
          propName +
          ' supplied to ' +
          componentName +
          '. Invalid projects'
      )
  },
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.shape({
    delOneWorkspace: PropTypes.func.isRequired,
    mutateOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Workspace
