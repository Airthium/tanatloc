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
    <div className={className + ' default-side'}>
      <div className={leftClassName + ' default-side-left'}>{left}</div>
      <div className={rightClassName + ' default-side-right'}>{right}</div>
    </div>
  )
}

export default Side
