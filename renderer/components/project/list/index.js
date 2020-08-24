import { Table, Button, Tag, Space, Avatar, Tooltip } from 'antd'
import {
  ShareAltOutlined,
  DeleteOutlined,
  SyncOutlined,
  CloudSyncOutlined
} from '@ant-design/icons'

const img = (
  <img
    style={{ width: 150, height: 100 }}
    alt="example"
    src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
  />
)

const tags = (
  <Space>
    <Tag icon={<SyncOutlined spin />} color="processing">
      Running
    </Tag>
    <Tag icon={<CloudSyncOutlined />} color="success">
      Backed-up in the cloud
    </Tag>
  </Space>
)

const sharedWith = (
  <Avatar.Group
    maxCount={3}
    maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
  >
    <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
    <Avatar style={{ backgroundColor: '#f56a00' }}>K</Avatar>
    <Tooltip title="Ant User" placement="top">
      <Avatar style={{ backgroundColor: '#87d068' }}>F</Avatar>
    </Tooltip>
    <Avatar style={{ backgroundColor: '#1890ff' }}>S</Avatar>
  </Avatar.Group>
)

const actions = 'hello'

const data = [
  {
    key: '1',
    snapshot: img,
    projectName: 'Salty Jesus',
    tags: tags,
    sharedWith: sharedWith,
    actions: actions
  },
  {
    key: '2',
    snapshot: img,
    projectName: 'Sweet Jesus',
    tags: tags,
    sharedWith: sharedWith,
    actions: actions
  },
  {
    key: '3',
    snapshot: img,
    projectName: 'Raptor Jesus',
    tags: tags,
    sharedWith: sharedWith,
    actions: actions
  },
  {
    key: '4',
    snapshot: img,
    projectName:
      'What’s the difference between the real Jesus and a picture of him ? It only takes one nail to hang up the picture.',
    tags: tags,
    sharedWith: sharedWith,
    actions: actions
  }
]

/**
 * Projects' list
 * @memberof module:renderer/components/project
 */
const ProjectList = () => {
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
      <Table.Column title="Project Name" dataIndex="projectName" />
      <Table.Column title="Status" dataIndex="tags" align="center" />
      <Table.Column title="Shared With" dataIndex="sharedWith" align="center" />
      <Table.Column
        title="Actions"
        dataIndex="actions"
        align="center"
        render={() => (
          <Space size="middle">
            <Button key="share" icon={<ShareAltOutlined />}>
              Share
            </Button>
            <Button icon={<DeleteOutlined />}>Delete</Button>
          </Space>
        )}
      />
    </Table>
  )
}

export default ProjectList
