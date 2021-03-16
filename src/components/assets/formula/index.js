/** @module components/assets/formula */

import { useState, useEffect } from 'react'
import { Button, Checkbox, Input, Space } from 'antd'
import { SaveOutlined } from '@ant-design/icons'

const saveDelay = 1000

/**
 * Formula
 * @param {Object} props Props
 */
const Formula = ({
  defaultValue,
  defaultChecked,
  onValueChange,
  onCheckedChange,
  unit
}) => {
  // State
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const [disabled, setDisabled] = useState(
    defaultChecked !== undefined ? !defaultChecked : false
  )
  const [autoSave, setAutoSave] = useState(false)
  const [autoSaveDisabled, setAutoSaveDisabled] = useState(true)
  const [loading, setLoading] = useState(false)

  // Units LaTeX
  useEffect(() => {
    window.MathJax?.typeset()
  }, [unit])

  /**
   * On check change
   * @param {Object} event
   */
  const onCheckboxChange = (event) => {
    const currentChecked = event.target.checked
    setInternalChecked(currentChecked)
    setAutoSaveDisabled(false)

    onCheckedChange(currentChecked)

    setDisabled(!currentChecked)
  }

  /**
   * On input change
   * @param {Object} event Event
   */
  const onInputChange = (event) => {
    const currentValue = event.target.value
    setInternalValue(currentValue)
    setAutoSaveDisabled(false)

    onValueChangeDelayed(currentValue)
  }

  /**
   * On value change (delayed)
   * @param {string} value Value
   */
  const onValueChangeDelayed = (value) => {
    if (autoSave) clearTimeout(autoSave)
    const id = setTimeout(() => {
      setLoading(true)
      onValueChange(value)
      setLoading(false)
      setAutoSaveDisabled(true)
    }, saveDelay)
    setAutoSave(id)
  }

  /**
   * Render
   */
  return (
    <Space>
      {defaultChecked !== undefined && (
        <Checkbox checked={internalChecked} onChange={onCheckboxChange} />
      )}
      <Input
        disabled={disabled}
        value={internalValue}
        onChange={onInputChange}
        addonAfter={unit}
      />
      <Button
        disabled={autoSaveDisabled}
        loading={loading}
        icon={<SaveOutlined />}
      />
    </Space>
  )
}

export default Formula
