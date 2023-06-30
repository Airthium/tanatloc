/** @module Components.Workspace */

import {
  useState,
  useEffect,
  ChangeEvent,
  useCallback,
  useContext
} from 'react'
import { Avatar, Input, Layout, Space, Tabs } from 'antd'
import { SearchOutlined } from '@ant-design/icons'

import {
  IFrontMutateWorkspacesItem,
  IFrontOrganizationsItem,
  IFrontUser,
  IFrontWorkspacesItem
} from '@/api/index.d'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'

import PageHeader from '@/components/assets/pageHeader'
import Share from '@/components/assets/share'

import ProjectAdd from '@/components/project/add'
import ProjectList from '@/components/project/list'

import Utils from '@/lib/utils'

import ProjectAPI from '@/api/project'

import Edit from './edit'
import Delete from './delete'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

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
    delOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
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
}: IProps): React.JSX.Element => {
  // State
  const [filter, setFilter] = useState<string>()
  const [sorter, setSorter] = useState<string>()

  // Context
  const { dispatch } = useContext(NotificationContext)

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
    if (errorProjects)
      dispatch(addError({ title: errors.projects, err: errorProjects }))
  }, [errorProjects, dispatch])

  /**
   * On change
   * @param event Event
   */
  const onChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void =>
      setFilter(event.target.value),
    []
  )

  /**
   * Render
   */
  return (
    <Layout className={globalStyle.noScroll}>
      <PageHeader
        footer={
          <Space
            direction="horizontal"
            size="large"
            className={`${style.search} ${globalStyle.fullWidth}`}
          >
            <Input
              placeholder="Enter a project name (case sensitive)"
              value={filter}
              onChange={onChange}
              style={{ width: 500 }}
              suffix={<SearchOutlined className={globalStyle.textLight} />}
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
          <div className={style.shared}>
            <div>
              <span style={{ marginRight: '10px' }}>Admin:</span>
              <Avatar.Group maxCount={5}>
                {workspace.owners?.map((u) => Utils.userToAvatar(u))}
              </Avatar.Group>
            </div>

            <div>
              <span style={{ marginRight: '10px' }}>Shared with:</span>
              <Avatar.Group maxCount={5}>
                {workspace.users?.map((u) => Utils.userToAvatar(u))}
              </Avatar.Group>
              <Avatar.Group maxCount={5}>
                {workspace.groups?.map((g) => Utils.groupToAvatar(g))}
              </Avatar.Group>
            </div>
          </div>
        ) : undefined}
      </PageHeader>
      <Tabs
        className={style.tabs}
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
        onChange={setSorter}
      />

      <Layout.Content className={globalStyle.scroll}>
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
            addOneProject,
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
