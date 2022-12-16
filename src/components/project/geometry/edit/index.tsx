/** @module Components.Project.Geometry.Edit */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Form, Input, InputRef } from 'antd'

import { IFrontGeometriesItem } from '@/api/index.d'

import Dialog from '@/components/assets/dialog'

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
  // Ref
  const inputRef = useRef<InputRef>(null)

  // State
  const [loading, setLoading] = useState<boolean>(false)

  // Autofocus
  useEffect(() => {
    if (inputRef.current) inputRef.current.focus()
  })

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(() => setVisible(false), [setVisible])

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    async (values: { name: string }): Promise<void> => {
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
    },
    [setVisible, onEdit]
  )

  /**
   * Render
   */
  return (
    <Dialog
      title="Edit the geometry's name"
      visible={visible}
      initialValues={{ name: geometry.name }}
      onCancel={setVisibleFalse}
      onOk={onOk}
      loading={loading}
    >
      <Form.Item
        name="name"
        label="Name:"
        rules={[{ required: true, message: 'Name is required' }]}
      >
        <Input ref={inputRef} />
      </Form.Item>
    </Dialog>
  )
}

export default Edit
