/** @module Components.Assets.Side */

import { css as Css, SerializedStyles } from '@emotion/react'

import style from './index.style'

export interface IProps {
  left: JSX.Element
  right: JSX.Element
  top?: JSX.Element
  css?: SerializedStyles
  leftCss?: SerializedStyles
  rightCss?: SerializedStyles
  topCss?: SerializedStyles
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
  css,
  leftCss,
  rightCss,
  topCss,
  id
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <div css={Css({ ...style.side, ...(css || {}) })} id={id}>
      <div css={Css({ ...style.left, ...(leftCss || {}) })}>{left}</div>
      <div css={Css({ ...style.right, ...(rightCss || {}) })}>{right}</div>
      {top && <div css={Css({ ...style.top, ...(topCss || {}) })}>{top}</div>}
    </div>
  )
}

export default Side
