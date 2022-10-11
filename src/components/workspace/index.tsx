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
  organizations: Pick<
    IFrontOrganizationsItem,
    'id' | 'name' | 'users' | 'owners' | 'groups'
  >[]
  swr: {
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
  }
}

/**
 * Errors
 */
export const errors = {
  projects: 'Error while loading projects',
  update: 'Unable to update workspace'
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
            {workspace?.owners?.find((o) => o.id === user.id) ? (
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
            ) : (
              <div />
            )}
          </Space>
        }
      >
        {workspace.users?.length || workspace.groups?.length ? (
          <div className="inWorkspace-shared">
            <div>
              <span className="marginRight-10">Admin:</span>
              <Avatar.Group maxCount={5}>
                {workspace.owners?.map((u) => Utils.userToAvatar(u))}
              </Avatar.Group>
            </div>

            <div>
              <span className="marginRight-10">Shared with:</span>
              <Avatar.Group maxCount={5}>
                {workspace.users?.map((u) => Utils.userToAvatar(u))}
              </Avatar.Group>
              <Avatar.Group maxCount={5}>
                {workspace.groups?.map((g) => Utils.groupToAvatar(g))}
              </Avatar.Group>
            </div>
          </div>
        ) : null}
      </PageHeader>
      <Tabs
        className="inWorkspace-Tabs"
        items={[
          {
            key: 'modifiedDesc',
            label: 'Last modified'
          },
          {
            key: 'alphaAsc',
            label: 'Name (A-Z)'
          },
          {
            key: 'alphaDesc',
            label: 'Name (Z-A)'
          }
        ]}
        defaultActiveKey="modifiedDesc"
        onChange={(key) => setSorter(key)}
      />

      <Layout.Content className="scroll">
        <ProjectList
          user={user}
          page={page}
          workspace={{
            id: workspace.id,
            projects: workspace.projects
          }}
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

export default Workspace
