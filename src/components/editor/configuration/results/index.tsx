import { IConfiguration } from '../..'

interface IProps {
  visible?: boolean
  results: IConfiguration['results']
  onOk: Function
  onClose: Function
}

const Results = ({ visible, results, onOk, onClose }: IProps): JSX.Element => {
  return <div />
}

export default Results
