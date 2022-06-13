export interface IProps {
  left: JSX.Element
  right: JSX.Element
  leftClassName?: string
  rightClassName?: string
  mainClassName?: string
}

const Side = ({
  left,
  right,
  leftClassName,
  rightClassName,
  mainClassName
}: IProps): JSX.Element => {
  return (
    <div className={mainClassName + ' default-side'}>
      <div className={leftClassName + ' width-50'}>{left}</div>
      <div className={rightClassName + ' width-50'}>{right}</div>
    </div>
  )
}

export default Side
