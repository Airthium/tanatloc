import { Button, Layout, PageHeader, Row, Col, Input, Typography, Avatar, Tooltip} from 'antd'

const { Footer, Sider, Content } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

import { AppstoreOutlined, PlusCircleTwoTone, DeleteOutlined,ShareAltOutlined } from '@ant-design/icons'

import ProjectCard from '../card'
import './index.less'

export default () => {
  return (
    <>
      <Content>
        <section className="main-container" style={{ position: 'relative', padding: '0px 64px 0 64px' }}>
          <div>
            <Row gutter={[0,16]}>
              <Col span={24} className="col-page-header">
                <PageHeader
                  ghost={false}
                  backIcon={false}
                  ghost={false}
                  onBack={() => window.history.back()}
                  title={<div><AppstoreOutlined /><span style={{marginLeft: '10px'}}>My Workspace > Home</span></div>}

                  extra={[
                    <Button key="1">Create a new workspace</Button>,
                    <Button key="3" icon={<ShareAltOutlined />}>Share it</Button>,
                    <Button
                    key="4"
                    size="default"
                    danger
                    icon={<DeleteOutlined />}
                    >Delete it</Button>
                  ]}
                >
                  <div style={{display: 'flex', alignItems: 'center'}}>
                    <span style={{marginRight: '10px'}}>This workspace is shared with:</span>
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
              </Col>
            </Row>
            <Row gutter={[16, 16]} justify="center">
            {/*
              <Col span={12}>
              <Search
                    placeholder="input search text"
                    enterButton="Search"
                    onSearch={value => console.log(value)}
              />
            </Col>
            */}
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Input addonBefore="Search" placeholder="Enter a project name" />
                </div>
              </Col>
              <Col>
                <Button
                      key="1"
                      type="primary"
                      icon={<PlusCircleTwoTone />}
                >
                Create a new project
                </Button>
              </Col>
            </Row>
          </div>
          <div className="scroll">
            <Row gutter={[16, 16]} justify="center" >
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
              <ProjectCard />
            </Row>
          </div>
        </section>
      </Content>
    </>
  )
}
