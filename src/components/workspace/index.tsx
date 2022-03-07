/** @module Components.Workspace */

import PropTypes from 'prop-types'
import React, { useState, useEffect, Dispatch, SetStateAction } from 'react'
import { Avatar, Button, Input, Layout, PageHeader, Space, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import {
  IOrganizationWithData,
  IUserWithData,
  IWorkspaceWithData
} from '@/lib/index.d'

import { ErrorNotification } from '@/components/assets/notification'
import Share from '@/components/assets/share'

import ProjectAdd from '@/components/project/add'
import ProjectList from '@/components/project/list'

import Utils from '@/lib/utils'

import ProjectAPI from '@/api/project'

import Edit from './edit'
import Delete from './delete'

/**
 * Props
 */
export interface IProps {
  user: IUserWithData
  page: string
  workspace: IWorkspaceWithData
  organizations: IOrganizationWithData[]
  swr: {
    delOneWorkspace: (workspace: IWorkspaceWithData) => void
    mutateOneWorkspace: (workspace: IWorkspaceWithData) => void
  }
}

/**
 * Errors
 */
export const errors = {
  projects: 'Projects error',
  update: 'Unable to update the workspace'
}

/**
 * Workspace
 * @param props Props
 * @returns Workspace
 */
const Workspace = ({
  user,
  page,
  workspace,
  organizations,
  swr
}: IProps): JSX.Element => {
  // State
  const [filter, setFilter]: [string, Dispatch<SetStateAction<string>>] =
    useState()
  const [sorter, setSorter]: [string, Dispatch<SetStateAction<string>>] =
    useState()

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
   * Render
   */
  return (
    <Layout className="no-scroll">
      <PageHeader
        className="inWorkspace-PageHeader"
        backIcon={false}
        footer={
          <Space
            direction="horizontal"
            size="large"
            className="full-width lastchild-marginLeft-auto"
          >
            <Input
              placeholder="Enter a project name (case sensitive)"
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              style={{ width: 500 }}
              suffix={<SearchOutlined className="text-light" />}
            />
            {workspace?.owners?.find((o) => o.id === user.id) && (
              <>
                <ProjectAdd
                  workspace={{
                    id: workspace.id,
                    projects: workspace.projects
                  }}
                  swr={{
                    mutateOneWorkspace: swr.mutateOneWorkspace,
                    addOneProject
                  }}
                />
                <Space size={8}>
                  <Edit
                    workspace={{
                      id: workspace.id,
                      name: workspace.name
                    }}
                    swr={{ mutateOneWorkspace: swr.mutateOneWorkspace }}
                  />
                  <Share
                    workspace={{
                      id: workspace.id,
                      name: workspace.name,
                      groups: workspace.groups
                    }}
                    organizations={organizations}
                    swr={{ mutateOneWorkspace: swr.mutateOneWorkspace }}
                    style={{ buttonDark: true, buttonBordered: true }}
                  />
                  <Delete
                    workspace={{
                      id: workspace.id
                    }}
                    swr={{ delOneWorkspace: swr.delOneWorkspace }}
                  />
                </Space>
              </>
            )}
          </Space>
        }
      >
        {workspace.users?.length || workspace.groups?.length ? (
          <div className="inWorkspace-shared">
            <span className="marginRight-10">
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
      <Tabs
        className="inWorkspace-Tabs"
        defaultActiveKey="modifiedDesc"
        onChange={(key) => setSorter(key)}
      >
        <Tabs.TabPane tab="Last modified" key="modifiedDesc" />
        <Tabs.TabPane tab="Name (A-Z)" key="alphaAsc" />
        <Tabs.TabPane tab="Name (Z-A)" key="alphaDesc" />
      </Tabs>
      <Layout.Content className="scroll">
        <ProjectList
          user={user}
          page={page}
          workspace={workspace}
          projects={projects}
          organizations={organizations}
          filter={filter}
          sorter={sorter}
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
  user: PropTypes.exact({
    id: PropTypes.string.isRequired
  }).isRequired,
  page: PropTypes.string.isRequired,
  workspace: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string,
    projects: PropTypes.arrayOf(PropTypes.string).isRequired,
    owners: PropTypes.array,
    users: PropTypes.array,
    groups: PropTypes.array
  }).isRequired,
  organizations: PropTypes.array.isRequired,
  swr: PropTypes.exact({
    delOneWorkspace: PropTypes.func.isRequired,
    mutateOneWorkspace: PropTypes.func.isRequired
  }).isRequired
}

export default Workspace
