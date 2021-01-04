import { useEffect } from 'react'
import { Card } from 'antd'

import { useSelector, useDispatch } from 'react-redux'
import {
  highlight,
  unhighlight,
  select,
  unselect
} from '../../../store/select/action'

/**
 * Selector
 * @param {Object} props Props
 */
const Selector = ({ part, updateSelected }) => {
  // Store
  const { highlighted, selected } = useSelector((state) => ({
    highlighted: state.select.highlighted,
    selected: state.select.selected
  }))
  const dispatch = useDispatch()

  // Selected
  useEffect(() => {
    updateSelected(selected)
  }, [selected])

  /**
   * On highglight
   * @param {string} uuid UUID
   */
  const onHighlight = (uuid) => {
    dispatch(highlight(uuid))
  }

  /**
   * On unhighlight
   */
  const onUnhighlight = () => {
    dispatch(unhighlight())
  }

  /**
   * On select
   * @param {string} uuid UUID
   */
  const onSelect = (uuid) => {
    if (selected.includes(uuid)) dispatch(unselect(uuid))
    else dispatch(select(uuid))
  }

  /**
   * Render
   */
  return part?.faces
    ? part.faces.map((face, index) => {
        return (
          <Card
            key={index}
            hoverable
            style={{
              marginBottom:
                highlighted === face.uuid
                  ? '5px'
                  : selected.includes(face.uuid)
                  ? '5px'
                  : '7px',
              border:
                highlighted === face.uuid
                  ? '2px solid #0096C7'
                  : selected.includes(face.uuid)
                  ? '2px solid #c73100'
                  : '1px solid grey'
            }}
            bodyStyle={{ padding: '10px' }}
            onMouseEnter={() => onHighlight(face.uuid)}
            onMouseLeave={onUnhighlight}
            onClick={() => onSelect(face.uuid)}
          >
            {face.name}
          </Card>
        )
      })
    : []
}

export default Selector
