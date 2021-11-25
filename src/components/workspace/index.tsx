/** @module Components.Workspace */

import PropTypes from 'prop-types'
import React, { useState, useEffect } from 'react'
import { Avatar, Input, Layout, PageHeader, Space } from 'antd'

import {
  IOrganizationWithData,
  IUserWithData,
  IWorkspaceWithData
} from '@/lib/index.d'

import Share from '@/components/assets/share'
import { Error as ErrorNotification } from '@/components/assets/notification'

import Edit from './edit'
import Delete from './delete'

import Loading from '@/components/loading'
import ProjectAdd from '@/components/project/add'
import ProjectList from '@/components/project/list'

import Utils from '@/lib/utils'

import ProjectAPI from '@/api/project'

export interface IProps {
  loading: boolean
  user: IUserWithData
  page: string
  workspace: IWorkspaceWithData
  organizations: IOrganizationWithData[]
  swr: {
    delOneWorkspace: Function
    mutateOneWorkspace: Function
  }
}

/**
 * Errors
 * @memberof Components.Workspace
 */
const errors = {
  projects: 'Projects error',
  update: 'Unable to update the workspace'
}

/**
 * Workspace
 * @memberof Components.Workspace
 * @param props Props
 */
const Workspace = ({
  loading,
  user,
  page,
  workspace,
  organizations,
  swr
}: IProps): JSX.Element => {
  // State
  const [filter, setFilter]: [string, Function] = useState()

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
   * On search
   * @param e Event
   */
  const onSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFilter(e.target.value)
  }

  /**
   * Render
   */
  if (loading) return <Loading.Simple />
  else
    return (
      <Layout>
        <PageHeader
          backIcon={false}
          footer={
            <Space
              direction="horizontal"
              size="large"
              style={{ width: '100%' }}
            >
              <Input.Search
                placeholder="Enter a project name (case sensitive)"
                value={filter}
                onChange={onSearch}
                style={{ width: 500 }}
              />
              {workspace?.owners?.find((o) => o.id === user.id) && (
                <>
                  <ProjectAdd
                    workspace={workspace}
                    swr={{
                      mutateOneWorkspace: swr.mutateOneWorkspace,
                      addOneProject
                    }}
                  />
                  <Edit
                    workspace={{
                      id: workspace.id,
                      name: workspace.name
                    }}
                    swr={{ mutateOneWorkspace: swr.mutateOneWorkspace }}
                  />
                  <Share
                    workspace={workspace}
                    organizations={organizations}
                    swr={{ mutateOneWorkspace: swr.mutateOneWorkspace }}
                    style={{ buttonType: 'default' }}
                  />
                  <Delete
                    workspace={workspace}
                    swr={{ delOneWorkspace: swr.delOneWorkspace }}
                  />
                </>
              )}
            </Space>
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
            page={page}
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
