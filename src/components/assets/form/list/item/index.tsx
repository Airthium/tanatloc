/** @module Components.Assets.Form.List.Item */

import { ReactNode, useCallback } from 'react'
import { Form, FormListFieldData } from 'antd'
import { MinusCircleOutlined } from '@ant-design/icons'

/**
 * Props
 */
export interface IProps {
  children: ReactNode[]
  field: FormListFieldData
  label: string
  index: number
  remove: (index: number | number[]) => void
}

/**
 * FormListItem
 * @param props Props
 * @returns FormListItem
 */
export const FormListItem = ({
  children,
  field,
  label,
  index,
  remove
}: IProps): JSX.Element => {
  /**
   * On remove
   */
  const onRemove = useCallback(() => remove(field.name), [field, remove])

  /**
   * Render
   */
  return (
    <Form.Item
      key={field.key}
      label={
        <div>
          <MinusCircleOutlined
            style={{
              fontSize: '16px',
              color: 'red',
              marginRight: '10px'
            }}
            onClick={onRemove}
          />
          {label} {index + 1}
        </div>
      }
    >
      {children}
    </Form.Item>
  )
}

export default FormListItem
