/** @module Components.Assets.Formula */

import { ChangeEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { Checkbox, Form, Input, Select, Space } from 'antd'
import { CheckboxChangeEvent } from 'antd/es/checkbox'
import { CheckCircleOutlined, LoadingOutlined } from '@ant-design/icons'

import { IModelVariable, IUnit } from '@/models/index.d'

import MathJax from '@/components/assets/mathjax'

import Large from './large'

import globalStyle from '@/styles/index.module.css'
import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  label?: string
  noLarge?: boolean
  className?: string
  dimension?: number
  defaultValue?: string | number
  defaultChecked?: boolean
  additionalKeywords?: IModelVariable[]
  units?: IUnit[]
  unit?: IUnit
  onValueChange: (value: string) => void
  onCheckedChange?: (value: boolean) => void
  onUnitChange?: (value: IUnit) => void
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
  noLarge,
  className,
  dimension,
  defaultValue,
  defaultChecked,
  additionalKeywords,
  units,
  unit,
  onValueChange,
  onCheckedChange,
  onUnitChange
}: IProps): React.JSX.Element => {
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
   * On select change
   * @param value Value
   */
  const onSelectChange = useCallback(
    (value: string): void => {
      const unit = units?.find((u) => u.label === value)!
      onUnitChange?.(unit)
    },
    [units, onUnitChange]
  )

  // Addon after
  const addonAfter = useMemo(() => {
    if (unit) {
      if (units && units.length > 1)
        return (
          <Select
            className={style.select}
            options={units.map((unit) => ({
              value: unit.label,
              label: <MathJax.Inline text={unit.label} />
            }))}
            onChange={onSelectChange}
            value={unit?.label}
          />
        )

      return <MathJax.Inline text={unit.label} />
    }

    return null
  }, [unit, units, onSelectChange])

  // Loading
  const loading = useMemo(
    () => <LoadingOutlined spin className={globalStyle.textOrange} />,
    []
  )

  // Ok
  const ok = useMemo(
    () =>
      noLarge ? (
        <CheckCircleOutlined className={globalStyle.textGreen} />
      ) : (
        <Large
          dimension={dimension}
          initialValue={internalValue}
          additionalKeywords={additionalKeywords}
          unit={unit}
          units={units}
          onChange={onInputChange}
          onUnitChange={onUnitChange}
        />
      ),
    [
      noLarge,
      dimension,
      internalValue,
      additionalKeywords,
      unit,
      units,
      onInputChange,
      onUnitChange
    ]
  )

  /**
   * Render
   */
  return (
    <Space
      className={`${globalStyle.fullWidth} ${style.formula} ${className}`}
      style={style}
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
            className={style.input}
            disabled={disabled}
            value={internalValue}
            onChange={onInputChange}
            addonBefore={saving ? loading : ok}
            addonAfter={addonAfter}
          />
        </Form.Item>
      </Form>
    </Space>
  )
}

export default Formula
