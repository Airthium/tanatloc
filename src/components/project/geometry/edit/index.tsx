/** @module Components.Project.Geometry.Edit */

import PropTypes from 'prop-types'
import { Dispatch, SetStateAction, useState } from 'react'
import { Form, Input } from 'antd'

import { IGeometry } from '@/database/index.d'

import Dialog from '@/components/assets/dialog'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  geometry: IGeometry
  setVisible: (visible: boolean) => void
  onEdit: (values: { name: string }) => Promise<void>
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
  const [loading, setLoading]: [boolean, Dispatch<SetStateAction<boolean>>] =
    useState(false)

  /**
   * Render
   */
  return (
    <Dialog
      title="Edit the geometry's name"
      visible={visible}
      initialValues={{ name: geometry.name }}
      onCancel={() => setVisible(false)}
      onOk={async (values) => {
        setLoading(true)
        try {
          await onEdit(values)

          // Close
          setLoading(false)
          setVisible(false)
        } catch (err) {
          setLoading(false)
          throw err
        }
      }}
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
