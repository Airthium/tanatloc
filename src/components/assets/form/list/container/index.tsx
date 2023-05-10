/** @module Components.Assets.Form.List.Container */

import { ReactNode, useCallback } from 'react'
import { Button, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

/**
 * Props
 */
export interface IProps {
  children: ReactNode[]
  label: string
  errors: ReactNode[]
  add: (defaultValue?: any, insertIndex?: number) => void
}

/**
 * FormListContainer
 * @param props Props
 * @returns FormListContainer
 */
const FormListContainer = ({
  children,
  label,
  errors,
  add
}: IProps): React.JSX.Element => {
  /**
   * On add
   */
  const onAdd = useCallback(() => add(), [add])

  /**
   * Render
   */
  return (
    <>
      {children}
      <Form.Item>
        <Button
          type="dashed"
          onClick={onAdd}
          style={{ width: '60%' }}
          icon={<PlusOutlined />}
        >
          Add {label}
        </Button>
        <Form.ErrorList errors={errors} />
      </Form.Item>
    </>
  )
}

export default FormListContainer
