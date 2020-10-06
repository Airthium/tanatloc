import { Input } from 'antd'

const Formula = ({ defaultValue, onChange }) => {
  const onInputChange = (event) => {
    const value = event.target.value
    onChange(value)
  }

  return <Input defaultValue={defaultValue} onChange={onInputChange} />
}

export default Formula
