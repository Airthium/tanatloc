import { Button, Drawer, Space } from 'antd'

import Selector from '../../../../assets/selector'

const Material = ({
  project,
  simulation,
  visible,
  part,
  materials,
  material,
  close
}) => {
  const onClose = () => {
    close()
  }

  return (
    <Drawer
      title="Material"
      placement="left"
      closable={false}
      visible={visible}
      mask={false}
      maskClosable={false}
      width={300}
    >
      Material
      <Space>
        <Button type="danger" onClick={onClose}>
          Cancel
        </Button>
      </Space>
    </Drawer>
  )
}

export default Material
