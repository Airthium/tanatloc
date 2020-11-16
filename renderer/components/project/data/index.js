import { Avatar, Empty, Tooltip, Typography } from 'antd'

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
 * Project data
 * @memberof module:renderer/components/project
 * @param {Object} project Project
 * @param {Function} setTitle Set title
 */
const Data = (project, filter, setTitle) => {
  // Check
  if (!project) return null

  // Filter
  if (filter && !project.title?.toLowerCase()?.includes(filter.toLowerCase()))
    return null

  // Snapshot
  const snapshot = project.avatar ? (
    <img
      src={project && project.avatar}
      style={{ cursor: 'pointer' }}
      width="100"
      height="100"
    />
  ) : (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      style={{ cursor: 'pointer' }}
      description={'No preview'}
      imageStyle={{ width: 150 }}
      description={<span>No projects yet</span>}
    />
  )

  // Title
  const title = (
    <Typography.Paragraph editable={{ maxLength: 50, onChange: setTitle }}>
      {project.title}
    </Typography.Paragraph>
  )

  // Owners avatars
  const owners =
    project &&
    project.owners &&
    project.owners.map((owner) => {
      let avatar = owner.avatar && Buffer.from(owner.avatar).toString()
      let name = ''
      let abbrev = ''
      if (owner.firstname || owner.lastname) {
        name = owner.firstname + ' ' + owner.lastname
        abbrev =
          (owner.firstname && owner.firstname[0]) +
          (owner.lastname && owner.lastname[0])
      } else {
        name = owner.email
        abbrev = owner.email[0]
      }

      return (
        <Tooltip key={owner.id} title={name}>
          <Avatar src={avatar} style={{ backgroundColor: stringToHex(name) }}>
            {abbrev.toUpperCase()}
          </Avatar>
        </Tooltip>
      )
    })

  // Users avatars
  const users =
    project &&
    project.users &&
    project.users.map((user) => {
      let avatar = user.avatar && Buffer.from(user.avatar).toString()
      let name = ''
      let abbrev = ''
      if (user.firstname || user.lastname) {
        name = user.firstname + ' ' + user.lastname
        abbrev =
          (user.firstname && user.firstname[0]) +
          (user.lastname && user.lastname[0])
      } else {
        name = user.email
        abbrev = user.email[0]
      }

      return (
        <Tooltip key={user.id} title={name}>
          <Avatar src={avatar} style={{ backgroundColor: stringToHex(name) }}>
            {abbrev.toUpperCase()}
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
    owners: <Avatar.Group>{owners}</Avatar.Group>,
    users: <Avatar.Group>{users}</Avatar.Group>
  }
}

export default Data

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
