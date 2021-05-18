import PropTypes from 'prop-types'
import { useState } from 'react'
import { Avatar, Button, Card, Divider, Empty, Typography } from 'antd'
import {
  DeleteOutlined,
  EditOutlined,
  ShareAltOutlined
} from '@ant-design/icons'

import Utils from '@/lib/utils'

/**
 * Project builder
 * @memberof module:components/project
 * @param {Array} projects Projects
 * @param {string} filter Filter
 * @param {Function} open Open project
 * @param {Function} setTitle Set title
 * @param {Function} setDescription Set description
 */
const Build = (projects, filter, open, setTitle, setDescription) => {
  // State
  const [descriptionVisible, setDescriptionVisible] = useState(-1)

  const list = projects
    .map((project) => {
      // Filter
      if (
        filter &&
        !project.title?.toLowerCase()?.includes(filter.toLowerCase())
      )
        return

      // Snapshot
      const snapshot = project.avatar ? (
        <img
          src={project && Buffer.from(project.avatar).toString()}
          width="140"
          height="140"
        />
      ) : (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={'No preview yet.'}
        />
      )

      // Title
      const title = (
        <>
          <Typography.Text>{project.title}</Typography.Text>
        </>
      )

      const description = project.description && (
        <Typography.Paragraph>{project.description}</Typography.Paragraph>
      )

      // Owners avatars
      const owners = project?.owners?.map((owner) => Utils.userToAvatar(owner))

      // Users avatars
      const users = project?.users?.map((user) => Utils.userToAvatar(user))

      // Groups
      const groups = project?.groups?.map((group) => Utils.groupToAvatar(group))

      return {
        key: project.id,
        snapshot,
        title,
        description,
        owners,
        users,
        groups
      }
    })
    .filter((p) => p)

  /**
   * Render
   */
  return list.map((project) => {
    return (
      <Card
        key={project.key}
        title={project.title}
        style={{
          width: 200,
          height: 300,
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div
          onMouseEnter={() =>
            setDescriptionVisible(project.description ? project.key : -1)
          }
          onMouseLeave={() => setDescriptionVisible(-1)}
          onClick={open(project.key)}
          style={{
            cursor: 'pointer',
            width: '100%',
            height: 150,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          {descriptionVisible === project.key
            ? project.description
            : project.snapshot}
        </div>

        <div
          style={{
            padding: '6px 0',
            display: 'flex',
            justifyContent: 'flex-start',
            alignItems: 'center',
            borderBottom: '1px solid #f0f0f0'
          }}
        >
          <Avatar.Group maxCount={5}>
            {project.owners}
            {project.users}
            {project.groups}
          </Avatar.Group>
        </div>

        <div
          style={{
            padding: '6px 0 0 0',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Button icon={<DeleteOutlined />} type="danger" />
          <Divider type="vertical" />
          <Button icon={<ShareAltOutlined />} />
          <Divider type="vertical" />
          <Button icon={<EditOutlined />} />
        </div>
      </Card>
    )
  })
}

Build.propTypes = {
  project: PropTypes.shape({
    title: PropTypes.string,
    avatar: PropTypes.object,
    owners: PropTypes.array,
    users: PropTypes.array,
    groups: PropTypes.array
  }),
  filter: PropTypes.string,
  setTitle: PropTypes.func.isRequired,
  setDescription: PropTypes.func.isRequired
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
