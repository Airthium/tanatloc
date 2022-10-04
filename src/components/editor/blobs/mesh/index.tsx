import { useState } from 'react'
import { Button, Form, Input } from 'antd'

import Dialog from '@/components/assets/dialog'

export interface IProps {
  onAdd: (values: { name: string }) => void
}

/**
 * Mesh
 * @param props Props
 * @returns Mesh
 */
const Mesh = ({ onAdd }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)

  /**
   * Render
   */
  return (
    <>
      <Dialog
        title="Mesh"
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
        Mesh
      </Button>
    </>
  )
}

export default Mesh
