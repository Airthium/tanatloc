import { useState } from 'react'
import { message, Button, Form, Input, Modal } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

//TODO
// import { add } from '../../../../src/api/project'

/**
 * Add project
 * @memberof module:renderer/components/project
 */
const Add = () => {
  const [form] = Form.useForm()
  const [visible, setVisible] = useState()
  const [loading, setLoading] = useState()

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
    // add(values)
    //   .then((workspace) => {
    //     // // Mutate
    //     // workspaces.push(workspace)
    //     // mutateWorkspaces({ workspaces: workspaces })

    //     setLoading(false)
    //     toggleVisible()
    //     form.resetFields()
    //   })
    //   .catch((err) => {
    //     message.error(err.message)
    //     setLoading(false)
    //   })
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
