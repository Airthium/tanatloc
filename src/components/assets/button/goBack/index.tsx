/** @module Components.Assets.Button.GoBack */

import { Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { css } from '@emotion/react'

import { globalStyle, variables } from '@/styles'

/**
 * Props
 */
export interface IProps {
  children?: string | React.ReactElement | React.ReactElement[]
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
const GoBack = ({ children, onClick }: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <Button
      css={globalStyle.noBorder}
      icon={<ArrowLeftOutlined css={css({ color: variables.colorPrimary })} />}
      onClick={onClick}
    >
      {children || 'Go back'}
    </Button>
  )
}

export default GoBack
