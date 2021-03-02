import { useState } from 'react'
import { Button, Select, Space } from 'antd'
import { ShareAltOutlined } from '@ant-design/icons'

import { EmailsInput } from '@/components/assets/input'
import { Error } from '@/components/assets/notification'
import Dialog from '@/components/assets/dialog'

import GroupAPI from '@/api/group'
import ProjectAPI from '@/api/project'

const errors = {
  shareError: 'Unable to share project'
}

/**
 * Share
 * @param {Object} props Props
 */
const Share = ({ workspace, project }) => {
  // State
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [values, setValues] = useState([])

  // Data
  const [groups] = GroupAPI.useGroups()
  const [, { mutateOneProject }] = ProjectAPI.useProjects(workspace?.projects)

  /**
   * On change
   * @param {Array} value Value
   */
  const onChange = (value) => {
    setValues(value)
  }

  /**
   * On share
   */
  const onShare = async () => {
    setLoading(true)

    try {
      // Update project
      await ProjectAPI.update({ id: project.id }, [
        {
          key: 'groups',
          value: values
        }
      ])

      // Mutate
      const newProject = { ...project }
      newProject.groups = values
      mutateOneProject(newProject)

      // Close
      setVisible(false)
    } catch (err) {
      Error(errors.shareError, err)
    }

    setLoading(false)
  }

  /**
   * Render
   */
  return (
    <>
      <Button
        key="share"
        icon={<ShareAltOutlined />}
        onClick={() => setVisible(true)}
      >
        Share it
      </Button>
      <Dialog
        title="Share project"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onShare}
        loading={loading}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <>
            Users (by emails):
            <EmailsInput />
          </>
          <>
            Groups:
            <Select
              mode="multiple"
              style={{ width: '100%' }}
              placeholder="Select groups"
              onChange={onChange}
              defaultValue={project?.groups?.map((g) => g.id)}
            >
              {groups.map((group) => (
                <Select.Option key={group.id} value={group.id}>
                  {group.name}
                </Select.Option>
              ))}
            </Select>
          </>
        </Space>
      </Dialog>
    </>
  )
}

export default Share
