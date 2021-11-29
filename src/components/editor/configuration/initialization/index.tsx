import { IConfiguration } from '../..'

interface IProps {
  visible?: boolean
  initialization: IConfiguration['initialization']
  onOk: Function
  onClose: Function
}

const Initialization = ({
  visible,
  initialization,
  onOk,
  onClose
}: IProps): JSX.Element => {
  return <div />
}

export default Initialization
