/** @module Components.Assets.Side */

import { css, SerializedStyles } from '@emotion/react'

import style from './index.style'

export interface IProps {
  left: JSX.Element
  right: JSX.Element
  top?: JSX.Element
  sideCss?: SerializedStyles
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
  sideCss,
  leftCss,
  rightCss,
  topCss,
  id
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <div css={css([style.side, sideCss || {}])} id={id}>
      <div css={css([style.left, leftCss || {}])}>{left}</div>
      <div css={css([style.right, rightCss || {}])}>{right}</div>
      {top && <div css={css([style.top, topCss || {}])}>{top}</div>}
    </div>
  )
}

export default Side
