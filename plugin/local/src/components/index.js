import { Button, Typography } from 'antd'
import { SelectOutlined } from '@ant-design/icons'

const Local = ({ onSelect }) => {
  const onClick = () => {
    onSelect()
  }

  return (
    <>
      <Typography.Text>Local computing</Typography.Text>
      <Button onClick={onClick} icon={<SelectOutlined />} />
    </>
  )
}

export default Local
