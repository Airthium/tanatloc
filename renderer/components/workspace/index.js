/** @module renderer/components/workspace */

import {
  message,
  Button,
  Divider,
  Layout,
  PageHeader,
  Row,
  Col,
  Input,
  Avatar,
  Tooltip,
  Typography
} from 'antd'

import { PlusCircleOutlined, ShareAltOutlined } from '@ant-design/icons'

import Add from './add'
import Delete from './delete'
import ProjectList from '../project/list'

// import useUser from '../../../src/api/user/useUser'
import { useWorkspace, update } from '../../../src/api/workspace'

const Workspace = (props) => {
  const workspace = props.workspace || {}
  // const [user] = useUser() // TODO get specific user
  const [workspaces, { mutateWorkspace }] = useWorkspace()

  const setName = (name) => {
    update(workspace, { name }).catch((err) => {
      message.error(err.message)
    })

    // Mutate workspace
    const newWorkspaces = workspaces.map((w) => {
      if (w.id === workspace.id) w.name = name
      return w
    })
    mutateWorkspace({ workspace: newWorkspaces })
  }

  return (
    <Layout className="Workspace no-scroll">
      <PageHeader
        backIcon={false}
        title={
          <Typography.Title
            level={4}
            className="Workspace-name"
            editable={{ onChange: setName }}
          >
            {workspace.name}
          </Typography.Title>
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
                <Button type="primary" icon={<PlusCircleOutlined />}>
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
