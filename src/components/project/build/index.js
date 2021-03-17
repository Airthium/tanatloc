import { Avatar, Collapse, Empty, Tooltip, Typography } from 'antd'

import Utils from '@/lib/utils'

/**
 * Project builder
 * @memberof module:components/project
 * @param {Object} project Project
 * @param {Function} setTitle Set title
 * @param {Function} setDescription Set description
 */
const Build = (project, filter, setTitle, setDescription) => {
  // Check
  if (!project) return null

  // Filter
  if (filter && !project.title?.toLowerCase()?.includes(filter.toLowerCase()))
    return null

  // Snapshot
  const snapshot = project.avatar ? (
    <img
      src={project && project.avatar}
      width="100"
      height="100"
      style={{ cursor: 'pointer' }}
    />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description={'No preview yet.'}
      imageStyle={{ width: 100 }}
      style={{ cursor: 'pointer' }}
    />
  )

  // Title
  const title = (
    <>
      <Typography.Paragraph editable={{ maxLength: 50, onChange: setTitle }}>
        {project.title}
      </Typography.Paragraph>
      {project.description && (
        <Collapse>
          <Collapse.Panel header="Description">
            <Typography.Paragraph
              editable={{
                maxLength: 260,
                autoSize: { maxRows: 4 },
                onChange: setDescription
              }}
            >
              {project.description}
            </Typography.Paragraph>
          </Collapse.Panel>
        </Collapse>
      )}
    </>
  )

  // Owners avatars
  const owners = project?.owners?.map((owner) => Utils.userToAvatar(owner))

  // Users avatars
  const users = project?.users?.map((user) => Utils.userToAvatar(user))

  // Groups
  const groups = project?.groups?.map((group) => {
    return (
      <Tooltip key={group.id} title={group.name}>
        <Avatar style={{ backgroundColor: Utils.stringToColor(group.name) }}>
          {group.name?.[0]?.toUpperCase()}
        </Avatar>
      </Tooltip>
    )
  })

  /**
   * Not a render
   */
  return {
    ...project,
    key: project.id,
    snapshot: snapshot,
    title: title,
    ownersRender: <Avatar.Group maxCount={5}>{owners}</Avatar.Group>,
    usersRender: (
      <>
        <Avatar.Group maxCount={5}>{users}</Avatar.Group>
        <Avatar.Group maxCount={5}>{groups}</Avatar.Group>
      </>
    )
  }
}

export default Build

// TODO
// import {
//   ShareAltOutlined,
//   DeleteOutlined
//   // SyncOutlined,
//   // CloudSyncOutlined
// } from '@ant-design/icons'

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
