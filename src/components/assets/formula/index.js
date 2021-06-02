/** @module components/assets/formula */

import { useState, useEffect } from 'react'
import { Checkbox, Input, Space } from 'antd'
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'

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
  const [saving, setSaving] = useState(false)

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
    setSaving(true)

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
    setSaving(true)

    onValueChangeDelayed(currentValue)
  }

  /**
   * On value change (delayed)
   * @param {string} value Value
   */
  const onValueChangeDelayed = (value) => {
    if (autoSave) clearTimeout(autoSave)
    const id = setTimeout(() => {
      onValueChange(value)
      setSaving(false)
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
        addonAfter={
          <Space>
            unit
            {saving ? (
              <LoadingOutlined spin style={{ color: 'orange' }} />
            ) : (
              <CheckCircleOutlined style={{ color: 'green' }} />
            )}
          </Space>
        }
      />
    </Space>
  )
}

export default Formula
