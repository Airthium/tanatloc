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

import ProjectCard from '../card'

const ProjectList = () => {
  return (
    <Layout className="ProjectList no-scroll">
      <PageHeader
        backIcon={false}
        title={
          <Breadcrumb>
            <Breadcrumb.Item>
              <AppstoreOutlined />
              <span>My Workspace</span>
            </Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
        }
        extra={[
          <Button key="create">Create a new workspace</Button>,
          <Button key="share" icon={<ShareAltOutlined />}>
            Share it
          </Button>,
          <Button key="delete" size="default" danger icon={<DeleteOutlined />}>
            Delete it
          </Button>
        ]}
        footer={
          <>
            <Divider className="ProjectList-divider" />
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
        <div className="ProjectList-share">
          <span style={{ marginRight: '10px' }}>
            This workspace is shared with:
          </span>
          <Avatar.Group>
            <Tooltip title="Marie" placement="bottom">
              <Avatar style={{ backgroundColor: '#023E8A' }}>M</Avatar>
            </Tooltip>
            <Tooltip title="Franck" placement="bottom">
              <Avatar style={{ backgroundColor: '#0077B6' }}>F</Avatar>
            </Tooltip>
            <Tooltip title="Karim" placement="bottom">
              <Avatar style={{ backgroundColor: '#0096C7' }}>K</Avatar>
            </Tooltip>
          </Avatar.Group>
        </div>
      </PageHeader>

      <Layout.Content className="scroll">
        <Row gutter={[0, 16]} justify="center">
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
          <ProjectCard />
        </Row>
      </Layout.Content>
    </Layout>
  )
}

export default ProjectList
