/** @module Components.Project.List */

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import {
  Avatar,
  Card,
  Carousel,
  Divider,
  Empty,
  Space,
  Tag,
  Typography
} from 'antd'

import Loading from '@/components/loading'
import Share from '@/components/assets/share'

import Edit from '../edit'
import Delete from '../delete'
import Archive from '../archive'

import {
  IFrontMutateProjectsItem,
  IFrontMutateWorkspacesItem,
  IFrontOrganizationsItem,
  IFrontProjectsItem,
  IFrontUser,
  IFrontWorkspacesItem
} from '@/api/index.d'

import Utils from '@/lib/utils'

import { globalStyle } from '@/styles'
import style from './index.style'

/**
 * Props
 */
export interface IProps {
  user: Pick<IFrontUser, 'id'>
  page: string
  workspace: Pick<IFrontWorkspacesItem, 'id' | 'projects'>
  projects: Pick<
    IFrontProjectsItem,
    | 'id'
    | 'archived'
    | 'title'
    | 'description'
    | 'createddate'
    | 'lastaccess'
    | 'avatar'
    | 'owners'
    | 'users'
    | 'groups'
  >[]
  organizations: Pick<
    IFrontOrganizationsItem,
    'id' | 'name' | 'owners' | 'users' | 'groups'
  >[]
  filter?: string
  sorter?: string
  swr: {
    mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => void
    delOneProject: (project: IFrontMutateProjectsItem) => void
    mutateOneProject: (project: IFrontMutateProjectsItem) => void
    loadingProjects: boolean
  }
}

export interface IListItem
  extends Pick<
    IFrontProjectsItem,
    | 'id'
    | 'archived'
    | 'title'
    | 'description'
    | 'createddate'
    | 'lastaccess'
    | 'avatar'
    | 'owners'
    | 'users'
    | 'groups'
  > {
  snapshotRender: JSX.Element
  descriptionRender: JSX.Element
  ownersRender: JSX.Element[]
  usersRender: JSX.Element[]
  groupsRender: JSX.Element[]
}

/**
 * Projects' list
 * @param props Props
 * @returns ProjectList
 */
const ProjectList = ({
  user,
  page,
  workspace,
  projects,
  organizations,
  filter,
  sorter,
  swr
}: IProps): JSX.Element => {
  // Ref
  const containerRef = useRef<HTMLDivElement>(null)

  // State
  const [loading, setLoading] = useState<boolean>(true)
  const [list, setList] = useState<IListItem[]>([])
  const [height, setHeight] = useState<number>(100)

  // Router
  const router = useRouter()

  // Height
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    const div = containerRef.current
    if (!div) return

    const offsets = div.getBoundingClientRect()
    const top = offsets.top

    const totalHeight = window.innerHeight

    const newHeight = totalHeight - top

    if (newHeight !== height) setHeight(newHeight)
  })

  // List
  useEffect(() => {
    const currentList = projects
      .map((project) => {
        // Filter
        if (
          filter &&
          !project.title?.toLowerCase()?.includes(filter.toLowerCase())
        )
          return

        // Snapshot
        let snapshot: JSX.Element
        if (project.archived)
          snapshot = <Empty description={'Archived project'} />
        else if (project.avatar)
          snapshot = (
            <img
              src={project && Buffer.from(project.avatar).toString()}
              alt="Tanatloc"
            />
          )
        else
          snapshot = (
            <Empty image="images/empty.svg" description={'No preview yet.'} />
          )

        // Description
        const description = (
          <Space
            direction="vertical"
            css={globalStyle.fullWidth}
            className="text-left"
          >
            <Typography.Text>
              <b>Created:</b>{' '}
              {new Date(project.createddate).toLocaleDateString()}
            </Typography.Text>
            <Typography.Text>
              <b>Last modified:</b>{' '}
              {new Date(project.lastaccess).toLocaleDateString()}
            </Typography.Text>
            {project.description && (
              <Typography.Paragraph ellipsis={{ rows: 4, tooltip: true }}>
                {project.description}
              </Typography.Paragraph>
            )}
          </Space>
        )

        // Owners avatars
        const owners = project?.owners?.map((o) => Utils.userToAvatar(o))

        // Users avatars
        const users = project?.users?.map((u) => Utils.userToAvatar(u))

        // Groups
        const groups = project?.groups?.map((g) => Utils.groupToAvatar(g))

        return {
          ...project,
          snapshotRender: snapshot,
          descriptionRender: description,
          ownersRender: owners,
          usersRender: users,
          groupsRender: groups
        }
      })
      .filter((p) => p) as IListItem[]

    switch (sorter) {
      case 'alphaAsc':
        currentList.sort((a, b) => a.title.localeCompare(b.title))
        break
      case 'alphaDesc':
        currentList.sort((a, b) => -1 * a.title.localeCompare(b.title))
        break
      case 'modifiedDesc':
        currentList.sort(
          (a, b) =>
            new Date(b.lastaccess).getTime() - new Date(a.lastaccess).getTime()
        )
        break
      default:
        break
    }
    setList(currentList)
    setLoading(false)
  }, [projects, filter, sorter])

  /**
   * Open project
   * @param project Project
   */
  const openProject = (project: { id: string }): void => {
    router.push({
      pathname: '/project',
      query: { page: page, workspaceId: workspace.id, projectId: project.id }
    })
  }

  /**
   * Render
   */
  if (loading || swr.loadingProjects) return <Loading.Simple />
  else if (!list.length)
    return (
      <Empty
        image="images/empty.svg"
        className="Project-Empty"
        description={
          filter ? (
            <>
              No project found with the current search{' '}
              <span className="Project-Empty-search-value">{filter}</span>...
            </>
          ) : (
            <>No project for now... Get started!</>
          )
        }
      />
    )
  else
    return (
      <div ref={containerRef} style={{ height: height }}>
        <Space className="marginBottom-20" wrap={true} align="start" size={20}>
          {list.map((project) => {
            return (
              <Card
                key={project.id}
                title={
                  <>
                    <Typography.Paragraph ellipsis={{ rows: 2, tooltip: true }}>
                      {project.title}
                    </Typography.Paragraph>
                    {project.archived && <Tag>Archived</Tag>}
                  </>
                }
                css={style.card}
                className={
                  'Project-Card' + (project.archived ? ' archive' : '')
                }
                cover={
                  <Carousel
                    className="Project-Carousel"
                    dots={{ className: 'Project-Carousel-dots' }}
                  >
                    <div
                      className={
                        'Project-Carousel-snapshot' +
                        (project.archived ? ' archive' : '')
                      }
                      onClick={() =>
                        !project.archived && openProject({ id: project.id })
                      }
                    >
                      {project.snapshotRender}
                    </div>
                    <div
                      className={
                        'Project-Carousel-description' +
                        (project.archived ? ' archive' : '')
                      }
                      onClick={() =>
                        !project.archived && openProject({ id: project.id })
                      }
                    >
                      {project.descriptionRender}
                    </div>
                  </Carousel>
                }
                actions={[
                  <Delete
                    key="delete"
                    disabled={!project?.owners?.find((o) => o.id === user?.id)}
                    workspace={{
                      id: workspace.id,
                      projects: workspace.projects
                    }}
                    project={{
                      id: project.id,
                      title: project.title
                    }}
                    swr={{
                      mutateOneWorkspace: swr.mutateOneWorkspace,
                      delOneProject: swr.delOneProject
                    }}
                  />,
                  <Archive
                    key="archive"
                    disabled={!project?.owners?.find((o) => o.id === user?.id)}
                    workspace={{
                      id: workspace.id
                    }}
                    project={{
                      archived: project.archived,
                      id: project.id,
                      title: project.title
                    }}
                    swr={{
                      mutateOneWorkspace: swr.mutateOneWorkspace,
                      mutateOneProject: swr.mutateOneProject
                    }}
                  />,
                  <Share
                    key="share"
                    disabled={!project?.owners?.find((o) => o.id === user?.id)}
                    project={{
                      id: project.id,
                      title: project.title,
                      groups: project.groups,
                      users: project.users
                    }}
                    organizations={organizations}
                    swr={{ mutateOneProject: swr.mutateOneProject }}
                    style={{
                      buttonDark: true
                    }}
                  />,
                  <Edit
                    key="edit"
                    disabled={!project?.owners?.find((o) => o.id === user?.id)}
                    project={{
                      id: project.id,
                      title: project.title,
                      description: project.description
                    }}
                    swr={{ mutateOneProject: swr.mutateOneProject }}
                  />
                ]}
              >
                <div
                  style={{
                    padding: '6px 0',
                    display: 'grid',
                    gridTemplateColumns: '10fr 1fr 20fr',
                    gridTemplateRows: 'auto auto'
                  }}
                >
                  <div>Admin:</div>
                  <div />
                  <div>Shared with:</div>
                  <Avatar.Group maxCount={5}>
                    {project.ownersRender}
                  </Avatar.Group>
                  <Divider
                    type="vertical"
                    style={{ height: '80%', borderColor: '#f0f0f0' }}
                  />
                  <Avatar.Group>
                    {project.usersRender}
                    {project.groupsRender}
                  </Avatar.Group>
                </div>
              </Card>
            )
          })}
        </Space>
      </div>
    )
}

export default ProjectList
