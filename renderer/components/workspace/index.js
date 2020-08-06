import {
  Button,
  Breadcrumb,
  Divider,
  Layout,
  PageHeader,
  Row,
  Col,
  Input,
  Avatar,
  Tooltip
} from 'antd'
import {
  AppstoreOutlined,
  PlusCircleTwoTone,
  DeleteOutlined,
  ShareAltOutlined
} from '@ant-design/icons'

import Add from './add'
import Delete from './delete'
import ProjectList from '../project/list'

// import useUser from '../../../src/api/user/useUser'

const Workspace = (props) => {
  const workspace = props.workspace || {}
  // const [user] = useUser() // TODO get specific user

  return (
    <Layout className="Workspace no-scroll">
      <PageHeader
        backIcon={false}
        title={
          <Breadcrumb>
            <Breadcrumb.Item>
              <AppstoreOutlined />
              <span>My Workspace</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>{workspace.name}</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={[
          <Add key="add" />,
          <Button key="share" icon={<ShareAltOutlined />}>
            Share it
          </Button>,
          <Delete key="delete" id={workspace.id} />
        ]}
        footer={
          <>
            <Divider className="Workspace-divider" />
            <Row gutter={[16, 16]} justify="center">
              <Col span={12}>
                <Input
                  addonBefore="Search"
                  placeholder="Enter a project name"
                />
              </Col>
              <Col>
                <Button type="primary" icon={<PlusCircleTwoTone />}>
                  Create a new project
                </Button>
              </Col>
            </Row>
          </>
        }
      >
        {workspace.users && (
          <div className="Workspace-share">
            <span style={{ marginRight: '10px' }}>
              This workspace is shared with:
            </span>
            <Avatar.Group>
              {workspace.users.map((user) => {
                return (
                  <Tooltip key={user} title={user} placement="bottom">
                    <Avatar style={{ backgroundColor: '#023E8A' }}>
                      {user}
                    </Avatar>
                  </Tooltip>
                )
              })}
              {/* 
            <Tooltip title="Franck" placement="bottom">
              <Avatar style={{ backgroundColor: '#0077B6' }}>F</Avatar>
            </Tooltip>
            <Tooltip title="Karim" placement="bottom">
              <Avatar style={{ backgroundColor: '#0096C7' }}>K</Avatar>
            </Tooltip> */}
            </Avatar.Group>
          </div>
        )}
      </PageHeader>

      <Layout.Content className="scroll">
        <ProjectList />
      </Layout.Content>
    </Layout>
  )
}

export default Workspace
