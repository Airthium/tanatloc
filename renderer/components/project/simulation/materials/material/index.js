import { Button, Drawer, Space } from 'antd'

import DataBase from '../database'
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
  const onSelected = () => {}

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
      <DataBase />
      <Selector part={part} updateSelected={onSelected} />
      <Space>
        <Button type="danger" onClick={onClose}>
          Cancel
        </Button>
      </Space>
    </Drawer>
  )
}

export default Material
