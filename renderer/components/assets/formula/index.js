/** @module renderer/components/assets/formula */

import { useState } from 'react'
import { Button, Input, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const saveDelay = 1000

/**
 * Formula
 * @param {Object} props Props
 */
const Formula = ({ value, onChange }) => {
  // State
  const [internalValue, setInternalValue] = useState(value)
  const [autoSave, setAutoSave] = useState(false)
  const [disabled, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)

  /**
   * On input change
   * @param {Object} event Event
   */
  const onInputChange = (event) => {
    const currentValue = event.target.value
    setInternalValue(currentValue)
    setDisabled(false)

    onChangeDelayed(currentValue)
  }

  /**
   * On change (delayed)
   * @param {string} value Value
   */
  const onChangeDelayed = (value) => {
    if (autoSave) clearTimeout(autoSave)
    const id = setTimeout(() => {
      setLoading(true)
      onChange(value)
      setLoading(false)
      setDisabled(true)
    }, saveDelay)
    setAutoSave(id)
  }

  /**
   * Render
   */
  return (
    <Space>
      <Input value={internalValue} onChange={onInputChange} />
      <Button disabled={disabled} loading={loading} icon={<SaveOutlined />} />
    </Space>
  )
}

export default Formula
