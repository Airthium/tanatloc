/** @module Components.Assets.Selector */

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
import { SelectState } from '@/store/select/reducer'

import Utils from '@/lib/utils'

export interface IProps {
  geometry: {
    faces?: {
      uuid: string
      number?: number
      name?: string
      color?: { r: number; g: number; b: number }
    }[]
    solids?: {
      uuid: string
      number?: number
      name?: string
      color?: { r: number; g: number; b: number }
    }[]
    edges?: {
      uuid: string
      number?: number
      name?: string
      color?: { r: number; g: number; b: number }
    }[]
  }
  alreadySelected?: Array<{
    label: string
    selected: Array<{ uuid: string }>
  }>
  updateSelected: Function
}

/**
 * Selector
 * @memberof Components.Assets.Selector
 * @param props Props
 * @description Props list:
 * - geometry (Object) Geometry
 * - alreadySelected (Array) Already selected
 * - updateSelected (Function) Update selected
 */
const Selector = ({
  geometry,
  alreadySelected,
  updateSelected
}: IProps): JSX.Element => {
  // State
  const [colors, setColors]: [{ r: number; g: number; b: number }[], Function] =
    useState([])
  const [filter, setFilter]: [{ r: number; g: number; b: number }, Function] =
    useState()

  // Store
  const { type, highlighted, selected } = useSelector(
    (state: { select: SelectState }) => ({
      type: state.select.type,
      highlighted: state.select.highlighted,
      selected: state.select.selected
    })
  )
  const dispatch = useDispatch()

  // Selected
  useEffect(() => {
    updateSelected(selected)
  }, [selected])

  // Colors
  useEffect(() => {
    const colorsList = []
    geometry?.[type]?.forEach(
      (element: { color?: { r: number; g: number; b: number } }) => {
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
      }
    )

    setColors(colorsList)
  }, [geometry, type])

  /**
   * On highglight
   * @param uuid UUID
   */
  const onHighlight = (uuid: string): void => {
    dispatch(highlight(uuid))
  }

  /**
   * On unhighlight
   */
  const onUnhighlight = (): void => {
    dispatch(unhighlight())
  }

  /**
   * On select
   * @param uuid UUID
   */
  const onSelect = (uuid: string): void => {
    if (selected.includes(uuid)) dispatch(unselect(uuid))
    else dispatch(select(uuid))
  }

  /**
   * On color fitler
   * @param color Color
   */
  const onColorFilter = (color?: { r: number; g: number; b: number }): void => {
    setFilter(color)
  }

  /**
   * Select all
   */
  const selectAll = (): void => {
    geometry?.[type]?.forEach(
      (element: {
        uuid: string
        color?: { r: number; g: number; b: number }
      }) => {
        if (
          !filter ||
          (filter &&
            filter.r === element.color?.r &&
            filter.g === element.color?.g &&
            filter.b === element.color?.b)
        )
          dispatch(select(element.uuid))
      }
    )
  }

  /**
   * Unselect all
   */
  const unselectAll = () => {
    geometry?.[type]?.forEach(
      (element: {
        uuid: string
        color?: { r: number; g: number; b: number }
      }) => {
        if (
          !filter ||
          (filter &&
            filter.r === element.color?.r &&
            filter.g === element.color?.g &&
            filter.b === element.color?.b)
        )
          dispatch(unselect(element.uuid))
      }
    )
  }

  /**
   * Swap selection
   */
  const selectSwap = () => {
    geometry?.[type]?.forEach(
      (element: {
        uuid: string
        color?: { r: number; g: number; b: number }
      }) => {
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
      }
    )
  }

  /**
   * Display?
   * @param element Element
   * @returns True/false
   */
  const display = (element: {
    uuid: string
    number?: number
    name?: string
    color?: { r: number; g: number; b: number }
  }) => {
    if (
      !filter ||
      (filter &&
        filter.r === element.color?.r &&
        filter.g === element.color?.g &&
        filter.b === element.color?.b)
    )
      return true
    return false
  }

  /**
   * Render
   */
  return (
    <Card>
      <Space direction="vertical">
        Filters
        <Space direction="horizontal" wrap={true}>
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
                  <Tooltip title="Color" key={JSON.stringify(color)}>
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
          ? geometry[type].map(
              (
                element: {
                  uuid: string
                  number?: number
                  name?: string
                  color?: { r: number; g: number; b: number }
                },
                index: number
              ) => {
                if (display(element)) {
                  let borderColor = ''
                  let backgroundColor = ''
                  let cursor = ''
                  if (
                    selected.includes(element.uuid) &&
                    highlighted !== element.uuid
                  ) {
                    borderColor = '#FAD114'
                    backgroundColor = 'rgba(255, 251, 230, 0.3)'
                  } else if (highlighted === element.uuid) {
                    borderColor = '#FAD114'
                    backgroundColor = '#FFFBE6'
                    cursor = 'pointer'
                  } else borderColor = 'transparent'

                  return (
                    <Card
                      key={index}
                      style={{
                        marginBottom: '7px',
                        cursor
                      }}
                      bodyStyle={{
                        position: 'relative',
                        padding: '10px 10px 10px 40px',
                        borderWidth: '2px',
                        borderStyle: 'solid',
                        borderColor,
                        backgroundColor
                      }}
                      onMouseEnter={() => onHighlight(element.uuid)}
                      onMouseLeave={onUnhighlight}
                      onClick={() => onSelect(element.uuid)}
                    >
                      <Space direction="vertical">
                        <div>
                          <div
                            style={{
                              position: 'absolute',
                              left: '-2px',
                              top: '-2px',
                              bottom: '-2px',
                              width: '30px',
                              backgroundColor: Utils.rgbToRgba(element.color, 1)
                            }}
                          />
                          {element.name}
                        </div>
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
                }
              }
            )
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
