/** @module Components.Assets.Selector */

import PropTypes from 'prop-types'
import {
  ChangeEvent,
  useState,
  useEffect,
  Dispatch,
  SetStateAction,
  useCallback
} from 'react'
import {
  Button,
  Card,
  Divider,
  Input,
  Space,
  Tag,
  Tooltip,
  Typography
} from 'antd'
import {
  CloseOutlined,
  CloseSquareOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  SwapOutlined
} from '@ant-design/icons'

import { useSelector, useDispatch } from 'react-redux'
import { highlight, unhighlight, select, unselect } from '@/store/select/action'
import { SelectState } from '@/store/select/reducer'

import Utils from '@/lib/utils'

/**
 * Color
 */
export interface IColor {
  r: number
  g: number
  b: number
}

/**
 * Props
 */
export interface IProps {
  geometry: {
    faces?: {
      uuid: string
      number?: number | string
      name?: string
      color?: IColor
    }[]
    solids?: {
      uuid: string
      number?: number | string
      name?: string
      color?: IColor
    }[]
    edges?: {
      uuid: string
      number?: number | string
      name?: string
      color?: IColor
    }[]
  }
  alreadySelected?: {
    label: string
    selected: { uuid: string; label: number }[]
  }[]
  updateSelected: (selected: string[]) => void
}

/**
 * Selector
 * @param props Props
 * @description Props list:
 * - geometry (Object) Geometry
 * - alreadySelected (Array) Already selected
 * - updateSelected (Function) Update selected
 * @returns Selector
 */
const Selector = ({
  geometry,
  alreadySelected,
  updateSelected
}: IProps): JSX.Element => {
  // State
  const [colors, setColors]: [IColor[], Dispatch<SetStateAction<IColor[]>>] =
    useState([])
  const [filter, setFilter]: [IColor, Dispatch<SetStateAction<IColor>>] =
    useState()
  const [search, setSearch]: [string, Dispatch<SetStateAction<string>>] =
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
  }, [updateSelected, selected])

  // Colors
  useEffect(() => {
    const colorsList = []
    geometry?.[type]?.forEach((element: { color?: IColor }) => {
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
  const onColorFilter = useCallback((color?: IColor): void => {
    setFilter(color)
  }, [])

  /**
   * Select all
   */
  const selectAll = (): void => {
    geometry?.[type]?.forEach((element: { uuid: string; color?: IColor }) => {
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
    geometry?.[type]?.forEach((element: { uuid: string; color?: IColor }) => {
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
    geometry?.[type]?.forEach((element: { uuid: string; color?: IColor }) => {
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
   * On search
   * @param e Event
   */
  const onSearch = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setSearch(value)
  }, [])

  /**
   * Display?
   * @param element Element
   * @returns True/false
   */
  const display = useCallback(
    (element: {
      uuid: string
      number?: number | string
      name?: string
      color?: IColor
    }) => {
      // Color filter
      if (
        filter &&
        (filter.r !== element.color?.r ||
          filter.g !== element.color?.g ||
          filter.b !== element.color?.b)
      )
        return false
      // Search
      if (search && element.name && !element.name.includes(search)) return false
      return true
    },
    [filter, search]
  )

  /**
   * Render
   */
  return (
    <Card size="small">
      <Space direction="vertical" className="full-width">
        <Typography.Text strong>Filters</Typography.Text>
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
        <Input
          placeholder="Search"
          value={search}
          onChange={onSearch}
          suffix={<SearchOutlined className="text-light" />}
        />
      </Space>

      <Divider className="border-light" />

      <div className="full-width">
        {geometry?.[type]
          ? geometry[type].map(
              (
                element: {
                  uuid: string
                  number?: number
                  name?: string
                  color?: IColor
                },
                index: number
              ) => {
                if (display(element)) {
                  let borderColor = 'transparent'
                  let backgroundColor = 'transparent'
                  if (
                    selected.includes(element.uuid) &&
                    highlighted !== element.uuid
                  ) {
                    borderColor = '#FAD114'
                    backgroundColor = 'rgba(255, 251, 230, 0.3)'
                  } else if (highlighted === element.uuid) {
                    borderColor = '#FAD114'
                    backgroundColor = '#FFFBE6'
                  }

                  return (
                    <Card
                      className="marginBottom-10"
                      key={index}
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
  geometry: PropTypes.exact({
    faces: PropTypes.arrayOf(
      PropTypes.exact({
        uuid: PropTypes.string.isRequired,
        number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string,
        color: PropTypes.object
      })
    ),
    solids: PropTypes.arrayOf(
      PropTypes.exact({
        uuid: PropTypes.string.isRequired,
        number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string,
        color: PropTypes.object
      })
    ),
    edges: PropTypes.arrayOf(
      PropTypes.exact({
        uuid: PropTypes.string.isRequired,
        number: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        name: PropTypes.string,
        color: PropTypes.object
      })
    )
  }).isRequired,
  alreadySelected: PropTypes.arrayOf(
    PropTypes.exact({
      label: PropTypes.string,
      selected: PropTypes.arrayOf(
        PropTypes.exact({
          uuid: PropTypes.string,
          label: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
        })
      )
    })
  ),
  updateSelected: PropTypes.func.isRequired
}

export default Selector
