import { Space, Table } from 'antd'

import Data from '../data'
import Delete from '../delete'

import { useProjects } from '../../../../src/api/project'

/**
 * Projects' list
 * @memberof module:renderer/components/project
 */
const ProjectList = (props) => {
  // Props
  const workspace = props.workspace || {}

  // Load projects
  const [projects] = useProjects(workspace.projects)

  const data = projects.map((project) => {
    return Data(project)
  })

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
        onCell={(record) => {
          return {
            onClick: () => {
              console.log(record) //it should only open if the user click on the snapshot
            }
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
