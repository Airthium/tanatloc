import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
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

import {
  IOrganizationWithData,
  IProjectWithData,
  IUserWithData,
  IWorkspaceWithData
} from '@/lib/index.d'

import Loading from '@/components/loading'
import Share from '@/components/assets/share'

import Edit from '../edit'
import Delete from '../delete'
import Archive from '../archive'

import Utils from '@/lib/utils'

export interface IProps {
  user: IUserWithData
  page: string
  workspace: IWorkspaceWithData
  projects: IProjectWithData[]
  organizations: IOrganizationWithData[]
  filter?: string
  swr: {
    mutateOneWorkspace: Function
    delOneProject: Function
    mutateOneProject: Function
    loadingProjects: boolean
  }
}

/**
 * Projects' list
 * @memberof Components.Project
 * @param props Props
 */
const ProjectList = ({
  user,
  page,
  workspace,
  projects,
  organizations,
  filter,
  swr
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(true)
  const [list, setList]: [
    Array<
      IProjectWithData & {
        snapshotRender: JSX.Element
        titleRender: JSX.Element
        descriptionRender: JSX.Element
        ownersRender: JSX.Element
        usersRender: JSX.Element
        groupsRender: JSX.Element
      }
    >,
    Function
  ] = useState([])

  // Router
  const router = useRouter()

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

        // Title
        const title = <Typography.Text>{project.title}</Typography.Text>

        const description = (
          <Space direction="vertical" style={{ textAlign: 'left' }}>
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
          titleRender: title,
          descriptionRender: description,
          ownersRender: owners,
          usersRender: users,
          groupsRender: groups
        }
      })
      .filter((p) => p)

    setList(currentList)
    setLoading(false)
  }, [projects, filter])

  // Open project
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
    return <Empty image="images/empty.svg" description={'No project found.'} />
  else
    return (
      <Space wrap={true} align="start">
        {list.map((project) => {
          return (
            <Card
              key={project.id}
              title={
                <>
                  <Typography.Paragraph ellipsis={{ rows: 2 }}>
                    {project.titleRender}
                  </Typography.Paragraph>
                  {project.archived && <Tag>Archived</Tag>}
                </>
              }
              className={'project-card' + (project.archived ? ' archive' : '')}
              cover={
                <Carousel
                  className="project-carousel"
                  autoplay
                  dots={{ className: 'project-dots' }}
                >
                  <div
                    className={
                      'project-carousel-snapshot' +
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
                      'project-carousel-description' +
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
                    groups: project.groups
                  }}
                  organizations={organizations}
                  swr={{ mutateOneProject: swr.mutateOneProject }}
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
                <Avatar.Group maxCount={5}>{project.ownersRender}</Avatar.Group>
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
    )
}

ProjectList.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.string
  }).isRequired,
  workspace: PropTypes.shape({
    id: PropTypes.string.isRequired,
    projects: PropTypes.array
  }).isRequired,
  projects: PropTypes.array.isRequired,
  organizations: PropTypes.array.isRequired,
  filter: PropTypes.string,
  swr: PropTypes.shape({
    mutateOneWorkspace: PropTypes.func.isRequired,
    delOneProject: PropTypes.func.isRequired,
    mutateOneProject: PropTypes.func.isRequired,
    loadingProjects: PropTypes.bool.isRequired
  }).isRequired
}

export default ProjectList