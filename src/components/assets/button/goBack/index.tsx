/** @module Components.Assets.Button.GoBack */

import { ReactNode } from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'

import globalStyle from '@/styles/index.module.css'

/**
 * Props
 */
export interface IProps {
  children?: ReactNode
  className?: string
  onClick: () => void
}

/**
 * Go back
 * @param props Props
 * @description Props list:
 * - children (React node) Button children (default to 'Go back')
 * - onClick (Function) Button click
 * @returns GoBack
 */
const GoBack = ({ children, className, onClick }: IProps): ReactNode => {
  /**
   * Render
   */
  return (
    <Button
      className={`${globalStyle.noBorder}  ${className}`}
      icon={<ArrowLeftOutlined className={globalStyle.primaryColor} />}
      onClick={onClick}
    >
      {children ?? 'Go back'}
    </Button>
  )
}

export default GoBack
