/** @namespace Components.Assets.Formula */

import { useState } from 'react'
import { Checkbox, Input, Space } from 'antd'
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'
import { MathJax } from 'better-react-mathjax'

interface IProps {
  defaultValue?: string
  defaultChecked?: boolean
  onValueChange: Function
  onCheckedChange: Function
  unit?: string
}

const saveDelay = 1000

/**
 * Formula
 * @memberof Components.Assets.Formula
 * @param {Object} props Props `{ defaultValue, defaultchecked, onValueChange, onCheckedChange }`
 * @description Props list:
 * - defaultValue (string) Default value
 * - defaultChecked (boolean) Default checked
 * - onValueChange (Function) On value change
 * - onCheckedChange (Function) On checked change
 */
const Formula = ({
  defaultValue,
  defaultChecked,
  onValueChange,
  onCheckedChange,
  unit
}: IProps): JSX.Element => {
  // State
  const [internalValue, setInternalValue] = useState(defaultValue)
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const [disabled, setDisabled] = useState(
    defaultChecked !== undefined ? !defaultChecked : false
  )
  const [autoSave, setAutoSave]: [number, Function] = useState(0)
  const [saving, setSaving] = useState(false)

  /**
   * On check change
   * @param {Object} event
   */
  const onCheckboxChange = (event): void => {
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
  const onInputChange = (event): void => {
    const currentValue = event.target.value
    setInternalValue(currentValue)
    setSaving(true)

    onValueChangeDelayed(currentValue)
  }

  /**
   * On value change (delayed)
   * @param {string} value Value
   */
  const onValueChangeDelayed = (value: string): void => {
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
            {unit && <MathJax dynamic>{unit}</MathJax>}
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
