/** @module 'src/components/assets/selector */

import { useState, useEffect } from 'react'
import { Button, Card, Divider, Space, Tag } from 'antd'
import {
  CloseOutlined,
  CloseSquareOutlined,
  PlusSquareOutlined,
  SwapOutlined
} from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux'
import { highlight, unhighlight, select, unselect } from '@/store/select/action'

import Utils from '@/lib/utils'

/**
 * Selector
 * @param {Object} props Props
 */
const Selector = ({ part, alreadySelected, updateSelected }) => {
  // State
  const [colors, setColors] = useState([])
  const [filter, setFilter] = useState()

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

  // Colors
  useEffect(() => {
    const colorsList = []
    part?.[type]?.forEach((element) => {
      if (element.color) {
        const existingColor = colorsList.find(
          (c) => c.join() === element.color.join()
        )
        if (!existingColor) {
          colorsList.push(element.color)
        }
      }
    })

    setColors(colorsList)
  }, [part])

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
   * On color fitler
   * @param {array} group color
   */
  const onColorFilter = (color) => {
    setFilter(color)
  }

  /**
   * Select all
   */
  const selectAll = () => {
    part?.[type]?.forEach((element) => {
      if (filter && filter.join() !== element.color?.join()) return
      dispatch(select(element.uuid))
    })
  }

  /**
   * Unselect all
   */
  const unselectAll = () => {
    part?.[type]?.forEach((element) => {
      if (filter && filter.join() !== element.color?.join()) return
      dispatch(unselect(element.uuid))
    })
  }

  /**
   * Swap selection
   */
  const selectSwap = () => {
    part?.[type]?.forEach((element) => {
      if (filter && filter.join() !== element.color?.join()) return
      if (selected.includes(element.uuid)) dispatch(unselect(element.uuid))
      else dispatch(select(element.uuid))
    })
  }

  /**
   * Render
   */
  return (
    <Card>
      <Space wrap={true}>
        {colors.length && (
          <Button icon={<CloseOutlined />} onClick={() => onColorFilter()} />
        )}
        {colors.map((color) => {
          return (
            <Button
              key={color}
              style={{ backgroundColor: Utils.rgbToHex(color) }}
              onClick={() => onColorFilter(color)}
            >
              {' '}
            </Button>
          )
        })}
        <Button icon={<PlusSquareOutlined />} onClick={selectAll} />
        <Button icon={<CloseSquareOutlined />} onClick={unselectAll} />
        <Button icon={<SwapOutlined />} onClick={selectSwap} />
      </Space>
      <Divider />
      {part?.[type]
        ? part[type].map((element, index) => {
            if (filter && filter.join() !== element.color?.join()) return
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
                <Space>
                  {element.name}
                  {alreadySelected?.map((a) => {
                    if (a.selected.find((s) => s.uuid === element.uuid))
                      return (
                        <Tag
                          key={element.uuid}
                          color={Utils.stringToColor(a.label)}
                        >
                          {a.label}
                        </Tag>
                      )
                  })}
                </Space>
              </Card>
            )
          })
        : []}
    </Card>
  )
}

export default Selector
