import { useRouter } from 'next/router'
import { Space, Table, Empty } from 'antd'

import { Error } from '../../assets/notification'

import Data from '../data'
import Delete from '../delete'

import ProjectAPI from '../../../../src/api/project'

/**
 * Errors project/list
 * @memberof module:renderer/components/project
 */
const errors = {
  updateError: 'Unable to update the project'
}

/**
 * Projects' list
 * @memberof module:renderer/components/project
 * @param {Object} props Props
 */
const ProjectList = ({ workspace, filter }) => {
  // Router
  const router = useRouter()

  // Load projects
  const [projects, { mutateOneProject }] = ProjectAPI.useProjects(
    workspace?.projects
  )

  // Data
  const data = projects
    .map((project) => {
      return Data(project, filter, (title) => setTitle(project, title))
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

  /**
   * Render
   */
  return (
    <Table
      pagination={false}
      dataSource={data}
      bordered={true}
      size="small"
      scroll={{ y: 'calc(100vh - 232px)' }}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No projects yet."
          />
        )
      }}
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
      <Table.Column title="Project Name" dataIndex="title" />
      <Table.Column title="Status" dataIndex="tags" align="center" />
      <Table.Column title="Administrators" dataIndex="owners" align="center" />
      {/* <Table.Column title="Shared With" dataIndex="users" align="center" /> */}
      <Table.Column
        title="Actions"
        align="center"
        render={(value) => (
          <Space size="middle">
            {/* <Button key="share" icon={<ShareAltOutlined />}>
              Share
            </Button> */}
            <Delete workspace={workspace} project={value} />
          </Space>
        )}
      />
    </Table>
  )
}

export default ProjectList
