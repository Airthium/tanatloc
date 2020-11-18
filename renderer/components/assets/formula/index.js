import { useState, useEffect } from 'react'
import { Input } from 'antd'

const Formula = ({ value, onChange }) => {
  const [internalValue, setInternalValue] = useState(value)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  const onInputChange = (event) => {
    const currentValue = event.target.value
    onChange(currentValue)
  }

  return <Input value={internalValue} onChange={onInputChange} />
}

export default Formula
