import { IConfiguration } from '../..'

interface IProps {
  visible?: boolean
  boundaryCondition: IConfiguration['boundaryConditions']
  onOk: Function
  onClose: Function
}

const BoundaryCondition = ({
  visible,
  boundaryCondition,
  onOk,
  onClose
}: IProps): JSX.Element => {
  return <div></div>
}

export default BoundaryCondition
