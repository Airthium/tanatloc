/** @module Components.Assets.Side */

import style from './index.module.css'

export interface IProps {
  left: JSX.Element
  right: JSX.Element
  top?: JSX.Element
  sideClassName?: string
  leftClassName?: string
  rightClassName?: string
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
  sideClassName,
  leftClassName,
  rightClassName,
  topClassName,
  id
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <div className={`${style.side} ${sideClassName || ''}`} id={id}>
      <div className={`${style.left} ${leftClassName || ''}`}>{left}</div>
      <div className={`${style.right} ${rightClassName || ''}`}>{right}</div>
      {top && <div className={`${style.top} ${topClassName || ''}`}>{top}</div>}
    </div>
  )
}

export default Side
