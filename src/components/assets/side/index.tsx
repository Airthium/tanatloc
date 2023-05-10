/** @module Components.Assets.Side */

import { CSSProperties } from 'react'

import style from './index.module.css'

export interface IProps {
  left: React.JSX.Element
  right: React.JSX.Element
  top?: React.JSX.Element
  sideStyle?: CSSProperties
  sideClassName?: string
  leftStyle?: CSSProperties
  leftClassName?: string
  rightStyle?: CSSProperties
  rightClassName?: string
  topStyle?: CSSProperties
  topClassName?: string
  id?: string
}

/**
 * Side
 * @param props Props
 * @returns Side
 */
const Side = ({
  left,
  right,
  top,
  sideStyle,
  sideClassName,
  leftStyle,
  leftClassName,
  rightStyle,
  rightClassName,
  topStyle,
  topClassName,
  id
}: IProps): React.JSX.Element => {
  /**
   * Render
   */

  return (
    <div
      className={`${style.side} ${sideClassName ?? ''}`}
      style={sideStyle}
      id={id}
    >
      <div className={`${style.left} ${leftClassName ?? ''}`} style={leftStyle}>
        {left}
      </div>
      <div
        className={`${style.right} ${rightClassName ?? ''}`}
        style={rightStyle}
      >
        {right}
      </div>
      {top && (
        <div className={`${style.top} ${topClassName ?? ''}`} style={topStyle}>
          {top}
        </div>
      )}
    </div>
  )
}

export default Side
