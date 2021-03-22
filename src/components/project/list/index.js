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
const ProjectList = ({ user, workspace, filter }) => {
  // Router
  const router = useRouter()

  // Load projects
  const [
    projects,
    { mutateOneProject, loadingProjects }
  ] = ProjectAPI.useProjects(workspace?.projects)

  // Data
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
      mutateOneProject({
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
      mutateOneProject({
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
      loading={loadingProjects}
      pagination={false}
      dataSource={data}
      bordered={true}
      size="small"
      // scroll={{ y: 'calc(100vh - 232px)' }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No projects yet."
          />
        )
      }}
      style={{ marginTop: '24px' }}
    >
      <Table.Column
        title=""
        dataIndex="snapshot"
        onCell={(project) => {
          return {
            onClick: () => openProject(project)
          }
        }}
      />
      <Table.Column title="Project" dataIndex="title" />
      {/* <Table.Column title="Status" dataIndex="tags" align="center" /> */}
      <Table.Column
        title="Administrators"
        dataIndex="ownersRender"
        align="center"
      />
      <Table.Column
        title="Shared With"
        dataIndex="usersRender"
        align="center"
      />
      <Table.Column
        title="Actions"
        align="center"
        render={(value) => (
          <Space direction="" wrap={true}>
            <Share workspace={workspace} project={value} />
            {value?.owners?.find((o) => o.id === user?.id) && (
              <Delete workspace={workspace} project={value} />
            )}
          </Space>
        )}
      />
    </Table>
  )
}

export default ProjectList
