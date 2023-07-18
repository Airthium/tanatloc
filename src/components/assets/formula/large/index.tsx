import { ChangeEvent, useCallback, useState } from 'react'
import { Form, Input, Radio, RadioChangeEvent, Tooltip } from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { parse } from '@airthium/tanatloc-formula-validator'

import { IUnit } from '@/models/index.d'

import Dialog from '@/components/assets/dialog'
import MathJax from '@/components/assets/mathjax'

/**
 * Props
 */
export interface IProps {
  initialValue: string
  units?: IUnit[]
  unit?: IUnit
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onUnitChange?: (value: IUnit) => void
}

/**
 * Large
 * @param props Props
 * @returns Large
 */
const Large = ({
  initialValue,
  unit,
  units,
  onChange,
  onUnitChange
}: IProps): React.JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false)
  const [value, setValue] = useState<string>(initialValue)
  const [error, setError] = useState<string>()

  /**
   * On open
   */
  const onOpen = useCallback(() => setVisible(true), [])

  /**
   * On close
   */
  const onClose = useCallback(() => setVisible(false), [])

  /**
   * On value change
   * @param event Event
   */
  const onValueChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>): void => {
      const newValue = event.target.value
      try {
        setError(undefined)
        // TODO additionalKeywords
        parse(newValue)
      } catch (err: any) {
        setError(err.message)
      }
      setValue(newValue)
    },
    []
  )

  /**
   * On unit change
   * @param event Event
   */
  const onInternalUnitChange = useCallback(
    (event: RadioChangeEvent): void => {
      const value = event.target.value
      const unit = units?.find((u) => u.label === value)!
      onUnitChange?.(unit)
    },
    [units, onUnitChange]
  )

  /**
   * On ok
   * @param values values
   */
  const onOk = useCallback(async (): Promise<void> => {
    onChange({
      target: { value: value }
    } as ChangeEvent<HTMLInputElement>)
  }, [value, onChange])

  /**
   * Render
   */
  return (
    <>
      <Tooltip title="Complex formula">
        <RightOutlined onClick={onOpen} />
      </Tooltip>
      <Dialog
        title="Formula"
        visible={visible}
        initialValues={{ formula: initialValue }}
        onOk={onOk}
        onCancel={onClose}
      >
        <Form.Item extra={<span style={{ color: 'red' }}>{error}</span>}>
          <Input.TextArea
            value={value}
            onChange={onValueChange}
            style={error ? { borderColor: 'red' } : {}}
          />
        </Form.Item>
        <Form.Item style={{ marginTop: '-24px' }}>
          <Radio.Group value={unit?.label} onChange={onInternalUnitChange}>
            {units?.map((u) => (
              <Radio.Button key={u.label} value={u.label}>
                <MathJax.Inline text={u.label} />
              </Radio.Button>
            ))}
          </Radio.Group>
        </Form.Item>
      </Dialog>
    </>
  )
}

export default Large
