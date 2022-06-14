/** @module Components.Assets.Side */

export interface IProps {
  left: JSX.Element
  right: JSX.Element
  top?: JSX.Element
  className?: string
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
  className,
  leftClassName,
  rightClassName,
  topClassName,
  id
}: IProps): JSX.Element => {
  /**
   * Render
   */
  return (
    <div className={'default-side ' + (className ?? '')} id={id}>
      <div className={'default-side-left ' + (leftClassName ?? '')}>{left}</div>
      <div className={'default-side-right ' + (rightClassName ?? '')}>
        {right}
      </div>
      {top && (
        <div className={'default-side-top ' + (topClassName ?? '')}>{top}</div>
      )}
    </div>
  )
}

export default Side
