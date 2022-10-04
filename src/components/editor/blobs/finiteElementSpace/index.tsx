import { useState } from 'react'
import { Button, Form, Input } from 'antd'

import Dialog from '@/components/assets/dialog'

/**
 * Props
 */
export interface IProps {
  onAdd: (value: { name: string }) => void
}

/**
 * Finite element space
 * @param props Props
 * @returns FiniteElementSpace
 */
const FiniteElementSpace = ({ onAdd }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Finite element space"
        visible={visible}
        onOk={async (values) => {
          onAdd(values)
          setVisible(false)
        }}
        onCancel={() => setVisible(false)}
      >
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Dialog>
      <Button className="full-width" onClick={() => setVisible(true)}>
        Finite element space
      </Button>
    </>
  )
}

export default FiniteElementSpace
