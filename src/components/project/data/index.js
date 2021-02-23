import { Avatar, Carousel, Empty, Tooltip, Typography } from 'antd'

import Utils from '@/lib/utils'

/**
 * Project data
 * @memberof module:'src/components/project
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
  const snapshot = (
    <Carousel
      autoplay
      style={{ cursor: 'pointer' }}
      dots={{ className: 'carousel-dots' }}
    >
      {project.avatar ? (
        <div>
          <img src={project && project.avatar} width="100" height="100" />
        </div>
      ) : (
        <div>
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={'No preview yet.'}
            imageStyle={{ width: 100 }}
          />
        </div>
      )}
      {project.description && (
        <div>
          <Typography.Title level={5}>Description:</Typography.Title>
          <Typography.Text>{project.description}</Typography.Text>
        </div>
      )}
    </Carousel>
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
      const avatar = owner.avatar && Buffer.from(owner.avatar).toString()
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
          <Avatar
            src={avatar}
            style={{ backgroundColor: Utils.stringToColor(name) }}
          >
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
      const avatar = user.avatar && Buffer.from(user.avatar).toString()
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
          <Avatar
            src={avatar}
            style={{ backgroundColor: Utils.stringToColor(name) }}
          >
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
