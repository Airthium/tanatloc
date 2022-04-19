/** @module Components.Assets.Formula */

import PropTypes from 'prop-types'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Checkbox, Form, Input, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'

import MathJax from '@/components/assets/mathjax'

/**
 * Props
 */
export interface IProps {
  label?: string
  className?: string
  defaultValue?: string | number
  defaultChecked?: boolean
  onValueChange: (value: string) => void
  onCheckedChange?: (value: boolean) => void
  unit?: string
}

/**
 * Save delay
 */
const saveDelay = 500

/**
 * Formula
 * @param props Props
 * @description Props list:
 * - label (string) Label
 * - className (string) Class name
 * - defaultValue (string) Default value
 * - defaultChecked (boolean) Default checked
 * - onValueChange (Function) On value change
 * - onCheckedChange (Function) On checked change
 * @returns Formula
 */
const Formula = ({
  label,
  className,
  defaultValue,
  defaultChecked,
  onValueChange,
  onCheckedChange,
  unit
}: IProps): JSX.Element => {
  // State
  const [internalValue, setInternalValue] = useState<string>(
    String(defaultValue)
  )
  const [internalChecked, setInternalChecked] = useState<boolean>(
    !!defaultChecked
  )
  const [disabled, setDisabled] = useState<boolean>(
    defaultChecked !== undefined ? !defaultChecked : false
  )
  const [autoSave, setAutoSave] = useState<number>(0)
  const [saving, setSaving] = useState<boolean>(false)

  // Default value
  useEffect(() => {
    setInternalValue(String(defaultValue))
  }, [defaultValue])

  // Default checked
  useEffect(() => {
    setInternalChecked(!!defaultChecked)
  }, [defaultChecked])

  /**
   * On check change
   * @param event
   */
  const onCheckboxChange = useCallback(
    (event: CheckboxChangeEvent): void => {
      const currentChecked = event.target.checked
      setInternalChecked(currentChecked)
      setSaving(true)

      onCheckedChange?.(currentChecked)

      setDisabled(!currentChecked)
    },
    [onCheckedChange]
  )

  /**
   * On value change (delayed)
   * @param value Value
   */
  const onValueChangeDelayed = useCallback(
    (value: string): void => {
      if (autoSave) clearTimeout(autoSave)
      const id = setTimeout(() => {
        onValueChange(value)
        setSaving(false)
      }, saveDelay)
      setAutoSave(+id)
    },
    [autoSave, onValueChange]
  )

  /**
   * On input change
   * @param event Event
   */
  const onInputChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>): void => {
      const currentValue = event.target.value
      setInternalValue(currentValue)
      setSaving(true)

      onValueChangeDelayed(currentValue)
    },
    [onValueChangeDelayed]
  )

  /**
   * Render
   */
  return (
    <Space className={className} align="start">
      {defaultChecked !== undefined && (
        <Checkbox checked={internalChecked} onChange={onCheckboxChange} />
      )}
      <Form layout="vertical">
        <Form.Item label={label}>
          <Input
            disabled={disabled}
            value={internalValue}
            onChange={onInputChange}
            addonAfter={
              <Space>
                <MathJax.Inline text={unit as string} />
                {saving ? (
                  <LoadingOutlined spin className="color-orange" />
                ) : (
                  <CheckCircleOutlined className="color-green" />
                )}
              </Space>
            }
          />
        </Form.Item>
      </Form>
    </Space>
  )
}

Formula.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  defaultChecked: PropTypes.bool,
  onValueChange: PropTypes.func.isRequired,
  onCheckedChange: PropTypes.func,
  unit: PropTypes.string
}

export default Formula
