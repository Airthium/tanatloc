import { useState } from 'react'
import { message, Button, Form, Input, Modal } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import { useProjects, add } from '../../../../src/api/project'
import { useWorkspaces } from '../../../../src/api/workspace'

/**
 * Add project
 * @memberof module:renderer/components/project
 */
const Add = (props) => {
  // Props
  const workspace = props.workspace || {}

  // State
  const [visible, setVisible] = useState()
  const [loading, setLoading] = useState()

  // Data
  const [projects, { mutateProjects }] = useProjects(workspace.projects)
  const [workspaces, { mutateWorkspaces }] = useWorkspaces()

  // Form
  const [form] = Form.useForm()

  /**
   * Toggle form visibility
   */
  const toggleVisible = () => {
    setVisible(!visible)
  }

  /**
   * On confirm
   * @param {Object} values Values
   */
  const onOk = (values) => {
    setLoading(true)
    add({ id: workspace.id }, values)
      .then((project) => {
        // Mutate projects
        console.log(project)
        const newProjects = projects.map((p) => {
          if (p.id === project.id) p.push(project)
          return p
        })
        mutateProjects({ projects: newProjects })

        // Mutate workspaces
        const newWorkspaces = workspaces.map((w) => {
          if (w.id === workspace.id) w.projects.push(project.id)
          return w
        })
        mutateWorkspaces({ workspaces: newWorkspaces })

        setLoading(false)
        toggleVisible()
        form.resetFields()
      })
      .catch((err) => {
        message.error(err.message)
        setLoading(false)
      })
  }

  /**
   * On cancel
   */
  const onCancel = () => {
    toggleVisible()
  }

  return (
    <>
      <Button
        onClick={toggleVisible}
        type="primary"
        icon={<PlusCircleOutlined />}
      >
        Create a new project
      </Button>
      <Modal
        title="Add a project"
        visible={visible}
        onCancel={() => {
          form.resetFields()
          onCancel()
        }}
        onOk={() => {
          form
            .validateFields()
            .then((values) => {
              onOk(values)
            })
            .catch((info) => {
              console.log('Validate Failed:', info)
            })
        }}
        confirmLoading={loading}
      >
        <Form form={form}>
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: 'Please fill the title' }]}
          >
            <Input placeholder="Project's title" />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input.TextArea placeholder="Project's description" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default Add
