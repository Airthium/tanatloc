/** @module components/assets/selector */

import PropTypes from 'prop-types'
import { useState, useEffect } from 'react'
import { Button, Card, Divider, Space, Tag, Tooltip } from 'antd'
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
      {colors.length > 1 && (
        <>
          <Space direction="vertical">
            Color helper
            <Space direction="" wrap={true}>
              <Tooltip title="Reset">
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => onColorFilter()}
                />
              </Tooltip>
              {colors.map((color) => {
                return (
                  <Tooltip title="Color">
                    <Button
                      key={color}
                      style={{ backgroundColor: Utils.rgbToHex(color) }}
                      onClick={() => onColorFilter(color)}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                )
              })}
              <Tooltip title="Select all">
                <Button icon={<PlusSquareOutlined />} onClick={selectAll} />
              </Tooltip>
              <Tooltip title="Unselect all">
                <Button icon={<CloseSquareOutlined />} onClick={unselectAll} />
              </Tooltip>
              <Tooltip title="Swap">
                <Button icon={<SwapOutlined />} onClick={selectSwap} />
              </Tooltip>
            </Space>
          </Space>
          <Divider />
        </>
      )}

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
                bodyStyle={{
                  padding: '10px',
                  backgroundImage:
                    'linear-gradient(to right, ' +
                    Utils.rgbToRgba(element.color, 0.25) +
                    '0%, rgba(255, 255, 255, 0) 25%)'
                }}
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

Selector.propTypes = {
  part: PropTypes.object.isRequired,
  alreadySelected: PropTypes.array,
  updateSelected: PropTypes.func.isRequired
}

export default Selector
