import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Space, Table, Empty } from 'antd'

import Share from '@/components/assets/share'
import { Error } from '@/components/assets/notification'

import Build from '../build'
import Delete from '../delete'

import ProjectAPI from '@/api/project'

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
  // Router
  const router = useRouter()

  // Data
  const columns = [
    {
      dataIndex: 'snapshot',
      key: 'snapshot',
      onCell: (project) => ({
        onClick: () => openProject(project)
      }),
      align: 'center'
    },
    {
      title: 'Project',
      dataIndex: 'titleRender',
      key: 'titleRender'
    },
    {
      title: 'Administrators',
      dataIndex: 'ownersRender',
      key: 'ownersRender',
      align: 'center'
    },
    {
      title: 'Shared With',
      dataIndex: 'usersRender',
      key: 'usersRender',
      align: 'center'
    },
    {
      title: 'Actions',
      align: 'center',
      render: (value) => (
        <Space direction="" wrap={true}>
          <Share
            project={value}
            organizations={organizations}
            swr={{ mutateOneProject: swr.mutateOneProject }}
          />
          {value?.owners?.find((o) => o.id === user?.id) && (
            <Delete
              workspace={workspace}
              project={value}
              swr={{
                mutateOneWorkspace: swr.mutateOneWorkspace,
                delOneProject: swr.delOneProject
              }}
            />
          )}
        </Space>
      )
    }
  ]

  const data = projects
    .map((project) => {
      return Build(
        project,
        filter,
        (title) => setTitle(project, title),
        (description) => setDescription(project, description)
      )
    })
    .filter((d) => d)

  // Open project
  const openProject = (project) => {
    router.push({
      pathname: '/project',
      query: { workspaceId: workspace.id, projectId: project.id }
    })
  }

  /**
   * Set title
   * @param {string} project Project { id }
   * @param {string} title Title
   */
  const setTitle = async (project, title) => {
    try {
      // Update
      await ProjectAPI.update({ id: project.id }, [
        {
          key: 'title',
          value: title
        }
      ])

      // Mutate project
      swr.mutateOneProject({
        ...project,
        title: title
      })
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * Set description
   * @param {Object} project Project
   * @param {string} description Description
   */
  const setDescription = async (project, description) => {
    try {
      // Update
      await ProjectAPI.update({ id: project.id }, [
        {
          key: 'description',
          value: description
        }
      ])

      // Mutate
      swr.mutateOneProject({
        ...project,
        description: description
      })
    } catch (err) {
      Error(errors.updateError, err)
    }
  }

  /**
   * Render
   */
  return (
    <Table
      loading={swr.loadingProjects}
      pagination={false}
      bordered={true}
      size="small"
      scroll={{ y: 'calc(100vh - 278px)' }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No projects yet."
          />
        )
      }}
      style={{ marginTop: '24px' }}
      columns={columns}
      dataSource={data}
    />
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
