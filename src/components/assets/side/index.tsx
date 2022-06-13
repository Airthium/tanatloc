export interface IProps {
  left: JSX.Element
  right: JSX.Element
  leftClassName?: string
  rightClassName?: string
}

const Side = ({
  left,
  right,
  leftClassName,
  rightClassName
}: IProps): JSX.Element => {
  return (
    <div style={{ display: 'flex' }}>
      <div className={leftClassName}>{left}</div>
      <div className={rightClassName}>{right}</div>
    </div>
  )
}

export default Side
