/** @module Components.Assets.Button.Link */

import { ReactNode } from 'react'
import { Button } from 'antd'

export interface IProps {
  children: string | ReactNode
  onClick: () => void
}

/**
 * Link button
 * @param props Props
 * @returns Link
 */
const Link = ({ children, onClick }) => {
  return (
    <Button type="link" onClick={onClick} style={{ padding: 0 }}>
      {children}
    </Button>
  )
}

export default Link
