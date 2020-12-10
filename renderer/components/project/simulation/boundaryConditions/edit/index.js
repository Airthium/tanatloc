import { Button } from 'antd'
import { EditOutlined } from '@ant-design/icons'

/**
 * Edit boundary condition
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Edit = ({ onEdit }) => {
  /**
   * Render
   */
  return <Button icon={<EditOutlined />} onClick={onEdit} />
}

export default Edit
