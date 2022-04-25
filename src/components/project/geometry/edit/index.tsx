/** @module Components.Project.Geometry.Edit */

import { useState } from 'react'
import { Form, Input } from 'antd'

import Dialog from '@/components/assets/dialog'

import { IFrontGeometriesItem } from '@/api/index.d'

/**
 * Props
 */
export interface IProps {
  visible: boolean
  geometry: Pick<IFrontGeometriesItem, 'id' | 'name'>
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
  const [loading, setLoading] = useState<boolean>(false)

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

export default Edit
