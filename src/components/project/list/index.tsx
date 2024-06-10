/** @module Components.Project.List */

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import {
  Avatar,
  Button,
  Card,
  Carousel,
  Divider,
  Dropdown,
  Empty,
  Space,
  Tag,
  Typography
} from 'antd'
import { EllipsisOutlined } from '@ant-design/icons'

import {
  IFrontMutateProjectsItem,
  IFrontMutateWorkspacesItem,
  IFrontNewProject,
  IFrontOrganizationsItem,
  IFrontProjectsItem,
  IFrontUser,
  IFrontWorkspacesItem
} from '@/api/index.d'

import Loading from '@/components/loading'
import Share from '@/components/assets/share'
import { asyncFunctionExec } from '@/components/utils/asyncFunction'

import Edit from '../edit'
import Delete from '../delete'
import Archive from '../archive'
import Copy from '../copy'

import Utils from '@/lib/utils'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

/**
 * Props
 */
export type User = Pick<IFrontUser, 'id'>
export type Workspace = Pick<IFrontWorkspacesItem, 'id' | 'projects'>
export type Project = Pick<
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
>
export type Organization = Pick<
  IFrontOrganizationsItem,
  'id' | 'name' | 'owners' | 'users' | 'groups'
>
export type Swr = {
  addOneProject: (project: IFrontNewProject) => Promise<void>
  mutateOneWorkspace: (workspace: IFrontMutateWorkspacesItem) => Promise<void>
  delOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
  mutateOneProject: (project: IFrontMutateProjectsItem) => Promise<void>
  loadingProjects: boolean
}
export interface IProps {
  user: User
  page: string
  workspace: Workspace
  projects: Project[]
  organizations: Organization[]
  filter?: string
  sorter?: string
  swr: Swr
}

export interface ICardProps {
  user: User
  workspace: Workspace
  page: string
  project: Project
  organizations: Organization[]
  swr: Swr
}

/**
 * ProjectCard
 * @param props Props
 * @returns ProjectCard
 */
const ProjectCard: React.FunctionComponent<ICardProps> = ({
  user,
  workspace,
  page,
  project,
  organizations,
  swr
}) => {
  // Router
  const router = useRouter()

  // Snapshot
  const snapshot = useMemo(() => {
    if (project.archived) return <Empty description={'Archived project'} />
    else if (project.avatar)
      return <img src={Buffer.from(project.avatar).toString()} alt="Tanatloc" />
    else
      return <Empty image="images/empty.svg" description={'No preview yet.'} />
  }, [project.archived, project.avatar])

  // Description
  const description = useMemo(
    () => (
      <Space
        direction="vertical"
        className={`${globalStyle.fullWidth} ${globalStyle.textAlignLeft}`}
      >
        <Typography.Text>
          <b>Created:</b> {new Date(project.createddate).toLocaleDateString()}
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
    ),
    [project.createddate, project.lastaccess, project.description]
  )

  // Owners
  const owners = useMemo(
    () => project.owners.map((o) => Utils.userToAvatar(o)),
    [project.owners]
  )

  // Users
  const users = useMemo(
    () => project.users.map((u) => Utils.userToAvatar(u)),
    [project.users]
  )

  // Groups
  const groups = useMemo(
    () => project.groups.map((g) => Utils.groupToAvatar(g)),
    [project.groups]
  )

  /**
   * Open project
   * @param project Project
   */
  const openProject = useCallback((): void => {
    asyncFunctionExec(async () => {
      if (project.archived) return

      await router.push({
        pathname: '/project',
        query: { page: page, workspaceId: workspace.id, projectId: project.id }
      })
    })
  }, [router, workspace.id, page, project.id, project.archived])

  /**
   * Return
   */
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
      className={`${style.card} ${project.archived ? style.cardArchived : ''}`}
      cover={
        <Carousel className={style.carousel} dots={{ className: 'dots' }}>
          <Button
            className={`${style.carouselSnapshot} ${
              project.archived ? style.carouselSnapshotArchived : ''
            }`}
            onClick={openProject}
          >
            {snapshot}
          </Button>
          <Button
            className={`${style.carouselDescription} ${
              project.archived ? style.carouselDescriptionArchived : ''
            }`}
            onClick={openProject}
          >
            {description}
          </Button>
        </Carousel>
      }
      actions={[
        <Edit
          key="edit"
          disabled={!project?.owners?.find((o) => o.id === user?.id)}
          project={{
            id: project.id,
            title: project.title,
            description: project.description
          }}
          swr={{ mutateOneProject: swr.mutateOneProject }}
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
        <Copy
          key="copy"
          workspace={{
            id: workspace.id,
            projects: workspace.projects
          }}
          project={{ id: project.id }}
          swr={{
            addOneProject: swr.addOneProject,
            mutateOneWorkspace: swr.mutateOneWorkspace
          }}
        />,
        <Dropdown
          key="more"
          trigger={['click']}
          menu={{
            items: [
              {
                key: 'archive',
                label: (
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
                  />
                )
              },
              {
                key: 'delete',
                label: (
                  <Delete
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
                  />
                )
              }
            ]
          }}
        >
          <Button
            icon={<EllipsisOutlined />}
            className={globalStyle.noBorder}
          />
        </Dropdown>
      ]}
    >
      <div className={style.cardUsers}>
        <div>Admin:</div>
        <div />
        <div>Shared with:</div>
        <Avatar.Group max={{ count: 5 }}>{owners}</Avatar.Group>
        <Divider type="vertical" className={style.cardDivider} />
        <Avatar.Group>
          {users}
          {groups}
        </Avatar.Group>
      </div>
    </Card>
  )
}

/**
 * Projects' list
 * @param props Props
 * @returns ProjectList
 */
const ProjectList: React.FunctionComponent<IProps> = ({
  user,
  page,
  workspace,
  projects,
  organizations,
  filter,
  sorter,
  swr
}) => {
  // Ref
  const containerRef = useRef<HTMLDivElement>(null)

  // State
  const [loading, setLoading] = useState<boolean>(true)
  const [list, setList] = useState<IFrontProjectsItem[]>([])
  const [height, setHeight] = useState<number>(100)

  /**
   * On resize
   */
  const onResize = useCallback(() => {
    const div = containerRef.current
    if (!div) {
      setTimeout(() => onResize(), 100)
      return
    }

    const offsets = div.getBoundingClientRect()
    const top = offsets.top

    const totalHeight = window.innerHeight

    const newHeight = totalHeight - top

    if (newHeight !== height) setHeight(newHeight)
  }, [height])

  // Height
  useEffect((): (() => void) => {
    window.addEventListener('resize', onResize)
    onResize()
    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  // List
  useEffect(() => {
    const currentList = projects
      .map((project) => {
        // Filter
        if (
          filter &&
          !project.title?.toLowerCase()?.includes(filter.toLowerCase())
        )
          return undefined

        return project
      })
      .filter((p) => p) as IFrontProjectsItem[]

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
   * Render
   */
  if (loading || swr.loadingProjects) return <Loading.Simple />
  if (!list.length)
    return (
      <Empty
        image="images/empty.svg"
        className={style.empty}
        description={
          filter ? (
            <>
              No project found with the current search{' '}
              <span className={style.emptySearch}>{filter}</span>...
            </>
          ) : (
            <>No project for now... Get started!</>
          )
        }
      />
    )
  return (
    <div ref={containerRef} style={{ height: height }}>
      <Space
        style={{ marginBottom: '20px' }}
        wrap={true}
        align="start"
        size={20}
      >
        {list.map((project) => (
          <ProjectCard
            key={project.id}
            user={user}
            workspace={workspace}
            page={page}
            project={project}
            organizations={organizations}
            swr={swr}
          />
        ))}
      </Space>
    </div>
  )
}

export default ProjectList
