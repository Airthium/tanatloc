/** @module Components.Project.Geometry.Edit */

import PropTypes from 'prop-types'
import { useState } from 'react'
import { Form, Input } from 'antd'

import { IGeometry } from '@/database/index.d'

import Dialog from '@/components/assets/dialog'

export interface IProps {
  visible: boolean
  geometry: IGeometry
  setVisible: Function
  onEdit: Function
}

/**
 * Edit
 * @param props Props
 */
const Edit = ({
  visible,
  geometry,
  setVisible,
  onEdit
}: IProps): JSX.Element => {
  // State
  const [loading, setLoading]: [boolean, Function] = useState(false)

  /**
   * On ok
   * @param values Values
   */
  const onOk = async (values: { name: string }): Promise<void> => {
    setLoading(true)

    await onEdit({ name: values.name })

    setLoading(false)
    setVisible(false)
  }

  /**
   * Render
   */
  return (
    <Dialog
      title="Edit the geometry's name"
      visible={visible}
      initialValues={{ name: geometry.name }}
      onCancel={() => setVisible(false)}
      onOk={onOk}
      loading={loading}
    >
      <Form.Item
        name="name"
        label="Name:"
        rules={[{ required: true, message: 'Name is required' }]}
      >
        <Input />
      </Form.Item>
    </Dialog>
  )
}

Edit.propTypes = {
  visible: PropTypes.bool.isRequired,
  geometry: PropTypes.exact({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  }).isRequired,
  setVisible: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired
}

export default Edit
