import PropTypes from 'prop-types'
import { useRouter } from 'next/router'
import { Space, Table, Empty } from 'antd'

import { Error } from '@/components/assets/notification'

import Build from '../build'
import Share from '../share'
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
const ProjectList = ({ user, workspace, filter, projects, swr }) => {
  // Router
  const router = useRouter()

  // Data
  const columns = [
    {
      dataIndex: 'snapshot',
      key: 'snapshot',
      onCell: (project) => ({
        onClick: () => openProject(project)
      })
    },
    {
      title: 'Project',
      dataIndex: 'title',
      key: 'title'
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
          <Share workspace={workspace} project={value} />
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
      scroll={{ y: 'calc(100vh - 238px)' }}
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
  user: PropTypes.object.isRequired,
  workspace: PropTypes.object.isRequired,
  filter: PropTypes.string,
  projects: PropTypes.array.isRequired,
  swr: PropTypes.object.isRequired
}

export default ProjectList
