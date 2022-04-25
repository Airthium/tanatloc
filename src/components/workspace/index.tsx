/** @module Components.Workspace */

import React, { useState, useEffect } from 'react'
import { Avatar, Input, Layout, PageHeader, Space, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import { ErrorNotification } from '@/components/assets/notification'
import Share from '@/components/assets/share'

import ProjectAdd from '@/components/project/add'
import ProjectList from '@/components/project/list'

import Utils from '@/lib/utils'

import {
  IFrontMutateWorkspacesItem,
  IFrontOrganizationsItem,
  IFrontUser,
  IFrontWorkspacesItem
} from '@/api/index.d'
import ProjectAPI from '@/api/project'

import Edit from './edit'
import Delete from './delete'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id'>
  page: string
  workspace: Pick<
    IFrontWorkspacesItem,
    'id' | 'name' | 'projects' | 'owners' | 'users' | 'groups'
  >
  organizations: Pick<IFrontOrganizationsItem, 'id' | 'name' | 'groups'>[]
  swr: {
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
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
  const [filter, setFilter] = useState<string>()
  const [sorter, setSorter] = useState<string>()

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
  const organizationsData = organizations.map((organization) => ({
    id: organization.id,
    name: organization.name,
    groups: organization.groups
  }))

  // Projects error
  useEffect(() => {
    if (errorProjects) ErrorNotification(errors.projects, errorProjects)
  }, [errorProjects])

  /**
   * Render
   */
  return (
    <Layout className="no-scroll">
      {/* 
      //@ts-ignore */}
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
                      groups: workspace.groups,
                      users: workspace.users
                    }}
                    organizations={organizationsData}
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
          workspace={{
            id: workspace.id,
            projects: workspace.projects
          }}
          projects={projects}
          organizations={organizationsData}
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

export default Workspace
