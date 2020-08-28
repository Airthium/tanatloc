/** @module renderer/components/workspace */

import {
  message,
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

// import { ShareAltOutlined } from '@ant-design/icons'

import Add from './add'
import Delete from './delete'

import ProjectAdd from '../project/add'
import ProjectList from '../project/list'

import { useWorkspaces, update } from '../../../src/api/workspace'

/**
 * Workspace
 * @param {Object} props Props
 */
const Workspace = (props) => {
  // Props
  const workspace = props.workspace || {}

  // Data
  const [[], { mutateOneWorkspace }] = useWorkspaces()

  /**
   * Set name
   * @param {string} name Name
   */
  const setName = (name) => {
    update(workspace, [{ key: 'name', value: name }])
      .then(() => {
        // Mutate workspace
        mutateOneWorkspace(workspace)
      })
      .catch((err) => {
        message.error(err.message)
        console.error(err)
      })
  }

  /**
   * Render
   */
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
          // <Button key="share" icon={<ShareAltOutlined />}>
          //   Share it
          // </Button>,
          <Delete key="delete" workspace={workspace} />
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
                <ProjectAdd workspace={workspace} />
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
        <ProjectList workspace={workspace} />
      </Layout.Content>
    </Layout>
  )
}

export default Workspace
