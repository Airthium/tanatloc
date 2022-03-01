/** @module Components.Assets.Formula */

import PropTypes from 'prop-types'
import { ChangeEvent, useEffect, useState } from 'react'
import { Checkbox, Input, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'

import MathJax from '@/components/assets/mathjax'

export interface IProps {
  label?: string
  defaultValue?: string
  defaultChecked?: boolean
  onValueChange: (value: string) => void
  onCheckedChange?: (value: boolean) => void
  unit?: string
}

const saveDelay = 1000

/**
 * Formula
 * @param props Props
 * @description Props list:
 * - label (string) Label
 * - defaultValue (string) Default value
 * - defaultChecked (boolean) Default checked
 * - onValueChange (Function) On value change
 * - onCheckedChange (Function) On checked change
 */
const Formula = ({
  label,
  defaultValue,
  defaultChecked,
  onValueChange,
  onCheckedChange,
  unit
}: IProps): JSX.Element => {
  // State
  const [internalValue, setInternalValue]: [string, Function] =
    useState(defaultValue)
  const [internalChecked, setInternalChecked]: [boolean, Function] =
    useState(defaultChecked)
  const [disabled, setDisabled]: [boolean, Function] = useState(
    defaultChecked !== undefined ? !defaultChecked : false
  )
  const [autoSave, setAutoSave]: [number, Function] = useState(0)
  const [saving, setSaving]: [boolean, Function] = useState(false)

  /**
   * On check change
   * @param event
   */
  const onCheckboxChange = (event: CheckboxChangeEvent): void => {
    const currentChecked = event.target.checked
    setInternalChecked(currentChecked)
    setSaving(true)

    onCheckedChange(currentChecked)

    setDisabled(!currentChecked)
  }

  /**
   * On input change
   * @param event Event
   */
  const onInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const currentValue = event.target.value
    setInternalValue(currentValue)
    setSaving(true)

    onValueChangeDelayed(currentValue)
  }

  /**
   * On value change (delayed)
   * @param value Value
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
      {label && <label>{label}:</label>}
      <Input
        disabled={disabled}
        value={internalValue}
        onChange={onInputChange}
        addonAfter={
          <Space>
            <MathJax.Inline text={unit} />
            {saving ? (
              <LoadingOutlined spin className="color-orange" />
            ) : (
              <CheckCircleOutlined className="color-green" />
            )}
          </Space>
        }
      />
    </Space>
  )
}

Formula.propTypes = {
  label: PropTypes.string,
  defaultValue: PropTypes.string,
  defaultChecked: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
  onCheckedChange: PropTypes.func,
  unit: PropTypes.string
}

export default Formula
