/** @module Plugins.Local.Components */

import { useCallback, useState } from 'react'
import { Button, Typography, Space, Modal, Form, InputNumber } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  parallel?: boolean
  onSelect: (data?: any) => void
}

export interface LocalParallelProps {
  onSelect: (data: any) => void
}

/**
 * Local parallel
 * @param props Props
 * @returns LocalParallel
 */
const LocalParallel: React.FunctionComponent<LocalParallelProps> = ({
  onSelect
}) => {
  // State
  const [open, setOpen] = useState<boolean>(false)

  // Data
  const [form] = Form.useForm()

  /**
   * On open
   */
  const onOpen = useCallback(() => setOpen(true), [])

  /**
   * On close
   */
  const onClose = useCallback(() => setOpen(false), [])

  /**
   * On ok
   * @param values Values
   */
  const onOk = useCallback(
    (values: { nCores: number }): void => {
      const nCores = values.nCores
      onSelect({ inUseConfiguration: { nCores: { value: nCores } } })
      onClose()
    },
    [onClose, onSelect]
  )

  // Render
  return (
    <>
      <Modal
        open={open}
        title="Local plugin"
        onCancel={onClose}
        onOk={form.submit}
        maskClosable={false}
        width="80%"
      >
        <Form form={form} initialValues={{ nCores: 2 }} onFinish={onOk}>
          <Form.Item
            label="Number of cores"
            name="nCores"
            rules={[{ type: 'number', min: 1 }]}
          >
            <InputNumber />
          </Form.Item>
        </Form>
      </Modal>
      <Space className={globalStyle.fullWidth}>
        <Typography.Text>Local computing</Typography.Text>
        <Button type="primary" onClick={onOpen} icon={<SelectOutlined />}>
          Select
        </Button>
      </Space>
    </>
  )
}

/**
 * Local
 * @param props Props
 * @returns Local
 */
const Local: React.FunctionComponent<IProps> = ({ parallel, onSelect }) => {
  /**
   * On click
   */
  const onClick = useCallback(() => {
    onSelect()
  }, [onSelect])

  /**
   * Render
   */
  if (parallel) return <LocalParallel onSelect={onSelect} />
  return (
    <Space
      className={globalStyle.fullWidth}
      style={{ display: 'flex', justifyContent: 'space-between' }}
    >
      <Typography.Text>Local computing</Typography.Text>
      <Button type="primary" onClick={onClick} icon={<SelectOutlined />}>
        Select
      </Button>
    </Space>
  )
}

export default Local
