import { IConfiguration } from '../..'

export interface IProps {
  initializations: IConfiguration['initializations']
  onEdit: (key: string) => void
  onDelete: (key: string) => void
}

const InitializationsList = ({
  initializations,
  onEdit,
  onDelete
}: IProps): JSX.Element => {
  return <div>InitializationsList</div>
}

export default InitializationsList
