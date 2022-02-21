import PropTypes from 'prop-types'
import { useState } from 'react'
import { Button, Form, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import Dialog from '@/components/assets/dialog'
import { Error } from '@/components/assets/notification'

import OrganizationAPI from '@/api/organization'

export interface IProps {
  swr: {
    addOneOrganization: Function
  }
}

/**
 * Errors (add)
 * @memberof Components.Organizations
 */
const errors = {
  addError: 'Unable to add organization'
}

/**
 * Add
 * @memberof Components.Organizations
 * @param props Props
 */
const Add = ({ swr }: IProps): JSX.Element => {
  // State
  const [visible, setVisible]: [boolean, Function] = useState(false)
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On add
   * @param values Values
   */
  const onAdd = async (values: { name: string }): Promise<void> => {
    setLoading(true)

    try {
      // API
      const organization = await OrganizationAPI.add({ name: values.name })

      // Local
      organization.name = values.name
      organization.owners = []
      swr.addOneOrganization(organization)

      // Close
      setLoading(false)
      setVisible(false)
    } catch (err) {
      Error(errors.addError, err)
      setLoading(false)
      throw err
    }
  }

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="New organization"
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={onAdd}
        loading={loading}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Name is required' }]}
        >
          <Input />
        </Form.Item>
      </Dialog>

      <Button icon={<PlusOutlined />} onClick={() => setVisible(true)}>
        New organization
      </Button>
    </>
  )
}

Add.propTypes = {
  swr: PropTypes.shape({
    addOneOrganization: PropTypes.func.isRequired
  }).isRequired
}

export default Add
