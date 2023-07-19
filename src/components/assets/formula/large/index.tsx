/** @module Components.Assets.Formula.Large */

import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import {
  Collapse,
  Form,
  Input,
  Radio,
  RadioChangeEvent,
  Table,
  Tooltip,
  Typography
} from 'antd'
import { RightOutlined } from '@ant-design/icons'
import { parse } from '@airthium/tanatloc-formula-validator'

import { IModelVariable, IUnit } from '@/models/index.d'

import Dialog from '@/components/assets/dialog'
import MathJax from '@/components/assets/mathjax'
import { ColumnsType } from 'antd/es/table'

/**
 * Props
 */
export interface IProps {
  dimension?: number
  initialValue: string
  additionalKeywords?: IModelVariable[]
  units?: IUnit[]
  unit?: IUnit
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onUnitChange?: (value: IUnit) => void
}

export interface DataType extends IModelVariable {}

/**
 * Large
 * @param props Props
 * @returns Large
 */
const Large = ({
  dimension,
  initialValue,
  additionalKeywords,
  unit,
  units,
  onChange,
  onUnitChange
}: IProps): React.JSX.Element => {
  const [visible, setVisible] = useState<boolean>(false)
  const [value, setValue] = useState<string>(initialValue)
  const [error, setError] = useState<string>()

  // Columns
  const columns: ColumnsType<DataType> = useMemo(
    () => [
      {
        title: 'Label',
        dataIndex: 'label',
        key: 'label'
      },
      {
        title: 'Keyword',
        dataIndex: 'value',
        key: 'value'
      }
    ],
    []
  )

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
        parse(newValue, {
          additionalKeywords: additionalKeywords
            ?.map((a) => {
              if (dimension === 2 && a.only3D) return
              return a.value
            })
            .filter((a) => a) as string[]
        })
      } catch (err: any) {
        setError(err.message)
      }
      setValue(newValue)
    },
    [dimension, additionalKeywords]
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
        <Form.Item
          extra={<span style={{ color: 'red' }}>{error}</span>}
          style={{ marginBottom: 0 }}
        >
          <Input.TextArea
            value={value}
            onChange={onValueChange}
            style={error ? { borderColor: 'red' } : {}}
          />
        </Form.Item>
        {units ? (
          <Form.Item>
            <Radio.Group value={unit?.label} onChange={onInternalUnitChange}>
              {units?.map((u) => (
                <Radio.Button key={u.label} value={u.label}>
                  <MathJax.Inline text={u.label} />
                </Radio.Button>
              ))}
            </Radio.Group>
          </Form.Item>
        ) : null}
        {additionalKeywords ? (
          <Form.Item>
            <Collapse
              items={[
                {
                  key: 'additional',
                  label: 'Additional keywords',
                  children: (
                    <>
                      <Typography.Text>
                        Additional keywods are model-specific keywords, in
                        addition to FreeFEM keywords.
                      </Typography.Text>
                      <Table
                        pagination={false}
                        columns={columns}
                        dataSource={additionalKeywords
                          .map((a) => ({
                            key: a.label,
                            ...a
                          }))
                          .filter((a) => !(dimension === 2 && a.only3D))}
                      />
                    </>
                  )
                }
              ]}
            />
          </Form.Item>
        ) : null}
      </Dialog>
    </>
  )
}

export default Large
