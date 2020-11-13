import { useRouter } from 'next/router'
import { message, Space, Table, Empty } from 'antd'

import Data from '../data'
import Delete from '../delete'

import { useProjects, update } from '../../../../src/api/project'

import Sentry from '../../../../src/lib/sentry'

/**
 * Projects' list
 * @memberof module:renderer/components/project
 * @param {Object} props Props
 */
const ProjectList = ({ workspace, filter }) => {
  // Router
  const router = useRouter()

  // Load projects
  const [projects, { mutateOneProject }] = useProjects(workspace?.projects)

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
      await update({ id: project.id }, [
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
      message.error(err.message)
      console.error(err)
      Sentry.captureException(err)
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
