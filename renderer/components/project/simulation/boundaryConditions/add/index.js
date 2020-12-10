import { Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

/**
 * Add boundary condition
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Add = ({ onAdd }) => {
  /**
   * Render
   */
  return <Button icon={<PlusCircleOutlined />} onClick={onAdd} />
}

export default Add
