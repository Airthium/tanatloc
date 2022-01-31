import { IConfiguration } from '../..'

export interface IProps {
  initialization?: IConfiguration['initializations']['key'] & { key: string }
  onAdd?: (values: IConfiguration['initializations']['key']) => void
  onEdit?: (values: IConfiguration['initializations']['key']) => void
}

const Initialization = ({
  initialization,
  onAdd,
  onEdit
}: IProps): JSX.Element => {
  return <div>Initialization</div>
}

export default Initialization
