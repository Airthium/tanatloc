import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Avatar, Card, Divider, Empty, Space, Typography } from 'antd'

import Loading from '@/components/loading'
import Share from '@/components/assets/share'

import Edit from '../edit'
import Delete from '../delete'

import Utils from '@/lib/utils'

/**
 * Errors project/list
 * @memberof module:components/project
 */
const errors = {
  updateError: 'Unable to update the project'
}

/**
 * Projects' list
 * @memberof module:components/project
 * @param {Object} props Props
 */
const ProjectList = ({
  user,
  workspace,
  projects,
  organizations,
  filter,
  swr
}) => {
  // State
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [descriptionVisible, setDescriptionVisible] = useState(-1)

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
        const snapshot = project.avatar ? (
          <img
            src={project && Buffer.from(project.avatar).toString()}
            width="140"
            height="140"
          />
        ) : (
          <Empty image="images/empty.svg" description={'No preview yet.'} />
        )

        // Title
        const title = <Typography.Text>{project.title}</Typography.Text>

        const description = project.description && (
          <Typography.Paragraph>{project.description}</Typography.Paragraph>
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
  }, [JSON.stringify(projects)])

  // Open project
  const openProject = (project) => {
    router.push({
      pathname: '/project',
      query: { workspaceId: workspace.id, projectId: project.id }
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
              title={project.titleRender}
              style={{
                width: 200,
                height: 300,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div
                onMouseEnter={() =>
                  setDescriptionVisible(project.description ? project.id : -1)
                }
                onMouseLeave={() => setDescriptionVisible(-1)}
                onClick={() => openProject({ id: project.id })}
                style={{
                  cursor: 'pointer',
                  width: '100%',
                  height: 150,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                {descriptionVisible === project.id
                  ? project.descriptionRender
                  : project.snapshotRender}
              </div>

              <div
                style={{
                  padding: '6px 0',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                  borderBottom: '1px solid #f0f0f0'
                }}
              >
                <Avatar.Group maxCount={5}>
                  {project.ownersRender}
                  {project.usersRender}
                  {project.groupsRender}
                </Avatar.Group>
              </div>

              <div
                style={{
                  padding: '6px 0 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <Delete
                  disabled={!project?.owners?.find((o) => o.id === user?.id)}
                  workspace={{
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
                <Divider type="vertical" />
                <Share
                  disabled={!project?.owners?.find((o) => o.id === user?.id)}
                  project={{
                    id: project.id,
                    groups: project.groups
                  }}
                  organizations={organizations}
                  swr={{ mutateOneProject: swr.mutateOneProject }}
                />
                <Divider type="vertical" />
                <Edit
                  disabled={!project?.owners?.find((o) => o.id === user?.id)}
                  project={{
                    id: project.id,
                    title: project.title,
                    description: project.description
                  }}
                  swr={{ mutateOneProject: swr.mutateOneProject }}
                />
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
    id: PropTypes.string.isRequired
  }).isRequired,
  projects: PropTypes.array.isRequired,
  organizations: PropTypes.array.isRequired,
  filter: PropTypes.string,
  swr: PropTypes.shape({
    delOneProject: PropTypes.func.isRequired,
    mutateOneProject: PropTypes.func.isRequired,
    loadingProjects: PropTypes.bool.isRequired
  }).isRequired
}

export default ProjectList
