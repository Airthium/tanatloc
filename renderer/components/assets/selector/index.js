/** @module renderer/components/assets/selector */

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
  const { type, highlighted, selected } = useSelector((state) => ({
    type: state.select.type,
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
  return part?.[type]
    ? part[type].map((element, index) => {
        return (
          <Card
            key={index}
            hoverable
            style={{
              marginBottom:
                highlighted === element.uuid
                  ? '5px'
                  : selected.includes(element.uuid)
                  ? '5px'
                  : '7px',
              border:
                highlighted === element.uuid
                  ? '2px solid #0096C7'
                  : selected.includes(element.uuid)
                  ? '2px solid #c73100'
                  : '1px solid grey'
            }}
            bodyStyle={{ padding: '10px' }}
            onMouseEnter={() => onHighlight(element.uuid)}
            onMouseLeave={onUnhighlight}
            onClick={() => onSelect(element.uuid)}
          >
            {element.name}
          </Card>
        )
      })
    : []
}

export default Selector
