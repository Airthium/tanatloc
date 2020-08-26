import { Table, Button, /*Tag,*/ Space, Avatar, Tooltip } from 'antd'
import {
  ShareAltOutlined,
  DeleteOutlined
  // SyncOutlined,
  // CloudSyncOutlined
} from '@ant-design/icons'

// const tags = (
//   <Space>
//     <Tag icon={<SyncOutlined spin />} color="processing">
//       Running
//     </Tag>
//     <Tag icon={<CloudSyncOutlined />} color="success">
//       Backed-up in the cloud
//     </Tag>
//   </Space>
// )

// const sharedWith = (
//   <Avatar.Group
//     maxCount={3}
//     maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
//   >
//     <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
//     <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
//     <Tooltip title="Ant User" placement="top">
//       <Avatar style={{ backgroundColor: '#87d068' }}>F</Avatar>
//     </Tooltip>
//     <Avatar style={{ backgroundColor: '#1890ff' }}>S</Avatar>
//   </Avatar.Group>
// )

import Delete from '../delete'

import { useProjects } from '../../../../src/api/project'

/**
 * Generate color (HEX format) from string
 * @memberof module:renderer/components/project
 * @param {string} str String
 */
const stringToHex = (str) => {
  let hash = 0
  for (let i = 0; i < str.length; ++i) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  let colour = '#'
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff
    colour += ('00' + value.toString(16)).substr(-2)
  }
  return colour
}

/**
 * Projects' list
 * @memberof module:renderer/components/project
 */
const ProjectList = (props) => {
  // Props
  const workspace = props.workspace || {}
  const projectsIds = workspace.projects || []

  // Load projects
  const [projects] = useProjects(projectsIds)

  const data = !projects
    ? []
    : projects.map((project) => {
        // Snapshot
        const snapshot = (
          <img src={project && project.avatar} width="100" height="100" />
        )

        // Owners avatars
        const owners =
          project &&
          project.owners &&
          project.owners.map((owner) => {
            const first = owner.firstname || 'No'
            const last = owner.lastname || 'Name'
            return (
              <Tooltip key={owner.id} title={first + ' ' + last}>
                <Avatar style={{ backgroundColor: stringToHex(first + last) }}>
                  {(first[0] + last[0]).toUpperCase()}
                </Avatar>
              </Tooltip>
            )
          })

        // Users avatars
        const users =
          project &&
          project.users &&
          project.users.map((user) => {
            const first = user.firstname || 'No'
            const last = user.lastname || 'Name'
            return (
              <Tooltip key={user.id} title={first + ' ' + last}>
                <Avatar style={{ backgroundColor: stringToHex(first + last) }}>
                  {(first[0] + last[0]).toUpperCase()}
                </Avatar>
              </Tooltip>
            )
          })

        return {
          ...project,
          key: project.id,
          snapshot: snapshot,
          owners: <Avatar.Group>{owners}</Avatar.Group>,
          users: <Avatar.Group>{users}</Avatar.Group>
        }
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
