export interface IProps {
  left: JSX.Element
  right: JSX.Element
  className?: string
  leftClassName?: string
  rightClassName?: string
}

const Side = ({
  left,
  right,
  className,
  leftClassName,
  rightClassName
}: IProps): JSX.Element => {
  return (
    <div className={'default-side ' + (className ?? '')}>
      <div className={'default-side-left ' + (leftClassName ?? '')}>{left}</div>
      <div className={'default-side-right ' + (rightClassName ?? '')}>
        {right}
      </div>
    </div>
  )
}

export default Side
