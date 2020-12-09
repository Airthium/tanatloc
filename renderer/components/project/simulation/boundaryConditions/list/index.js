import { Card } from 'antd'

import { useDispatch } from 'react-redux'
import {
  enable as selectorEnable,
  disable as selectorDisable,
  select as selectorSelect
} from '../../../../../store/select/action'

import Edit from '../edit'
import Delete from '../delete'

const List = ({ project, simulation }) => {
  // Data
  const boundaryConditions =
    simulation?.scheme?.configuration?.boundaryConditions || {}
  const dispatch = useDispatch()

  /**
   * Highlight current
   * @param {string} key Key
   * @param {number} index Index
   */
  const highlight = (key, index) => {
    dispatch(selectorEnable())
    const currentSelected = boundaryConditions[key]?.values[index]?.selected
    currentSelected.forEach((s) => {
      dispatch(selectorSelect(s.uuid))
    })
  }

  /**
   * Unhighlight current
   */
  const unhighlight = () => {
    dispatch(selectorDisable())
  }

  // List
  const list = Object.keys(boundaryConditions)
    .map((type) => {
      if (type === 'index' || type === 'title' || type === 'done') return
      return boundaryConditions[type].values?.map((child, index) => {
        return (
          <Card
            key={index}
            hoverable
            style={{ marginTop: '5px' }}
            onMouseEnter={() => highlight(type, index)}
            onMouseLeave={() => unhighlight()}
          >
            {child.name}
            <Edit type={type} index={index} />
            <Delete
              project={project}
              simulation={simulation}
              type={type}
              index={index}
            />
          </Card>
        )
      })
    })
    .filter((l) => l)

  /**
   * Render
   */
  return list
}

export default List
