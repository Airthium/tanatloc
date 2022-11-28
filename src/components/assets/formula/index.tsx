/** @module Components.Assets.Formula */

import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { Checkbox, Form, Input, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { css as Css, SerializedStyles } from '@emotion/react'

import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'

import MathJax from '@/components/assets/mathjax'

import { globalStyle } from '@/styles'

/**
 * Props
 */
export interface IProps {
  label?: string
  css?: SerializedStyles
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
 * - css (SerializedStyles) CSSinJS
 * - defaultValue (string) Default value
 * - defaultChecked (boolean) Default checked
 * - onValueChange (Function) On value change
 * - onCheckedChange (Function) On checked change
 * @returns Formula
 */
const Formula = ({
  label,
  css,
  defaultValue,
  defaultChecked,
  onValueChange,
  onCheckedChange,
  unit
}: IProps): JSX.Element => {
  // State
  const [internalValue, setInternalValue] = useState<string>(
    String(defaultValue ?? 0)
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
    setInternalValue(String(defaultValue ?? 0))
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
    <Space
      css={Css({
        ...globalStyle.fullWidth,
        ...(css || {})
      })}
      align="start"
    >
      <Form layout="vertical">
        <Form.Item
          label={
            <>
              {defaultChecked !== undefined && (
                <Checkbox
                  checked={internalChecked}
                  onChange={onCheckboxChange}
                  style={{ marginRight: '5px' }}
                />
              )}
              {label}
            </>
          }
        >
          <Input
            disabled={disabled}
            value={internalValue}
            onChange={onInputChange}
            addonAfter={
              <Space css={globalStyle.fullWidth}>
                <MathJax.Inline text={unit as string} />
                {saving ? (
                  <LoadingOutlined spin css={globalStyle.textOrange} />
                ) : (
                  <CheckCircleOutlined css={globalStyle.textGreen} />
                )}
              </Space>
            }
          />
        </Form.Item>
      </Form>
    </Space>
  )
}

export default Formula
