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
const Selector = ({ geometry, alreadySelected, updateSelected }) => {
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
    geometry?.[type]?.forEach((element) => {
      if (element.color) {
        const existingColor = colorsList.find(
          (c) =>
            c.r === element.color.r &&
            c.g === element.color.g &&
            c.b === element.color.b
        )
        if (!existingColor) {
          colorsList.push(element.color)
        }
      }
    })

    setColors(colorsList)
  }, [geometry, type])

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
    geometry?.[type]?.forEach((element) => {
      if (
        !filter ||
        (filter &&
          filter.r === element.color?.r &&
          filter.g === element.color?.g &&
          filter.b === element.color?.b)
      )
        dispatch(select(element.uuid))
    })
  }

  /**
   * Unselect all
   */
  const unselectAll = () => {
    geometry?.[type]?.forEach((element) => {
      if (
        !filter ||
        (filter &&
          filter.r === element.color?.r &&
          filter.g === element.color?.g &&
          filter.b === element.color?.b)
      )
        dispatch(unselect(element.uuid))
    })
  }

  /**
   * Swap selection
   */
  const selectSwap = () => {
    geometry?.[type]?.forEach((element) => {
      if (
        !filter ||
        (filter &&
          filter.r === element.color?.r &&
          filter.g === element.color?.g &&
          filter.b === element.color?.b)
      ) {
        if (selected.includes(element.uuid)) dispatch(unselect(element.uuid))
        else dispatch(select(element.uuid))
      }
    })
  }

  /**
   * Render
   */
  return (
    <Card>
      <Space direction="vertical">
        Filters
        <Space direction="" wrap={true}>
          {colors.length > 1 && (
            <>
              <Tooltip title="Reset">
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => onColorFilter()}
                />
              </Tooltip>
              {colors.map((color) => {
                return (
                  <Tooltip title="Color" key={color}>
                    <Button
                      style={{ backgroundColor: Utils.rgbToHex(color) }}
                      onClick={() => onColorFilter(color)}
                    >
                      {' '}
                    </Button>
                  </Tooltip>
                )
              })}
            </>
          )}
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

      <Divider style={{ borderColor: '#f0f0f0' }} />

      <div
        style={{
          width: '100%',
          maxHeight: '30vh',
          overflowY: 'auto'
        }}
      >
        {geometry?.[type]
          ? geometry[type].map((element, index) => {
              if (
                !filter ||
                (filter &&
                  filter.r === element.color?.r &&
                  filter.g === element.color?.g &&
                  filter.b === element.color?.b)
              )
                return (
                  <Card
                    key={index}
                    hoverable
                    style={{
                      width: '180px',
                      marginBottom: '7px'
                    }}
                    bodyStyle={{
                      padding: '10px',
                      textAlign: 'center',
                      borderLeft:
                        '30px solid ' + Utils.rgbToRgba(element.color, 1)
                    }}
                    onMouseEnter={() => onHighlight(element.uuid)}
                    onMouseLeave={onUnhighlight}
                    onClick={() => onSelect(element.uuid)}
                  >
                    <Space direction="" wrap={true} align="center">
                      <div
                        style={{
                          position: 'absolute',
                          top: '13px',
                          left: '190px',
                          width: '20px',
                          height: '20px',
                          borderRadius: '10px',
                          backgroundColor:
                            highlighted === element.uuid
                              ? '#0096C7'
                              : selected.includes(element.uuid)
                              ? '#c73100'
                              : 'transparent'
                        }}
                      />
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
      </div>
    </Card>
  )
}

Selector.propTypes = {
  geometry: PropTypes.object.isRequired,
  alreadySelected: PropTypes.array,
  updateSelected: PropTypes.func.isRequired
}

export default Selector
