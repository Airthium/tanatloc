import { Button } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

const Local = ({ onSelect }) => {
  const onClick = () => {
    onSelect()
  }

  return <Button onClick={onClick} icon={<SelectOutlined />} />
}

export default Local
