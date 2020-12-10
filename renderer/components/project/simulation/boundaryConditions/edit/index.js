import { Button } from 'antd'

/**
 * Edit boundary condition
 * @memberof module:renderer/components/project/simulation
 * @param {Object} props Props
 */
const Edit = ({ disabled, boundaryCondition }) => {
  const onEdit = () => {
    console.log(boundaryCondition)
  }
  /**
   * Render
   */
  return <Button disabled={disabled} onClick={onEdit} />
}

export default Edit
