import PropTypes from 'prop-types'
import { Avatar, Collapse, Empty, Typography } from 'antd'

import Utils from '@/lib/utils'

/**
 * Project builder
 * @memberof module:components/project
 * @param {Object} project Project
 * @param {string} filter Filter
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
  const groups = project?.groups?.map((group) => Utils.groupToAvatar(group))

  /**
   * Not a render
   */
  return {
    ...project,
    key: project.id,
    snapshot: snapshot,
    titleRender: title,
    ownersRender: <Avatar.Group maxCount={5}>{owners}</Avatar.Group>,
    usersRender: (
      <>
        <Avatar.Group maxCount={5}>{users}</Avatar.Group>
        <Avatar.Group maxCount={5}>{groups}</Avatar.Group>
      </>
    )
  }
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
