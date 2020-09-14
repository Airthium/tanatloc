import { useRouter } from 'next/router'
import { message, Space, Table } from 'antd'

import Data from '../data'
import Delete from '../delete'

import { useProjects, update } from '../../../../src/api/project'

/**
 * Projects' list
 * @memberof module:renderer/components/project
 */
const ProjectList = (props) => {
  // Props
  const workspace = props.workspace || {}

  // Router
  const router = useRouter()

  // Load projects
  const [projects, { mutateOneProject }] = useProjects(workspace.projects)

  // Data
  const data = projects.map((project) => {
    return Data(project, (title) => setTitle(project, title))
  })

  // Open project
  const openProject = (project) => {
    router.push('/project/' + project.id)
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

      // Update project
      project.title = title

      // Mutate project
      mutateOneProject(project)

      // Todo reload data ?
    } catch (err) {
      message.error(err.message)
      console.error(err)
    }
  }

  /**
   * Render
   */
  return (
    <Table
      tableLayout="auto"
      pagination={false}
      dataSource={data}
      bordered={false}
      size="small"
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
