/** @module Components.Assets.Selector */

import {
  ChangeEvent,
  useState,
  useEffect,
  useCallback,
  useContext
} from 'react'
import { Button, Card, Input, Space, Tag, Tooltip, Typography } from 'antd'
import {
  CloseOutlined,
  CloseSquareOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  SwapOutlined
} from '@ant-design/icons'
import { css } from '@emotion/react'

import { IFrontGeometriesItem } from '@/api/index.d'

import { TGeometryColor } from '@/database/geometry/get'

import { SelectContext, ISelect } from '@/context/select'
import {
  highlight,
  unhighlight,
  select,
  unselect
} from '@/context/select/actions'

import useCustomEffect from '@/components/utils/useCustomEffect'

import Utils from '@/lib/utils'

import { globalStyle, globalStyleFn } from '@/styles'

//TODO need global refactoring

// Local interfaces
export interface ISelection {
  label: string
  selected: { uuid: string; label: number }[]
}

/**
 * Props
 */
export interface IProps {
  geometry: Pick<IFrontGeometriesItem, 'summary'>
  alreadySelected?: ISelection[]
  updateSelected: (selected: ISelect[]) => void
}

/**
 * Selector
 * @param props Props
 * @description Props list:
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
  const [colors, setColors] = useState<TGeometryColor[]>([])
  const [filter, setFilter] = useState<TGeometryColor>()
  const [search, setSearch] = useState<string>()

  // Context
  const { type, highlighted, selected, dispatch } = useContext(SelectContext)

  // Selected
  useCustomEffect(
    () => {
      updateSelected(selected)
    },
    [selected],
    [updateSelected]
  )

  // Colors
  useEffect(() => {
    const colorsList: TGeometryColor[] = []
    if (type)
      geometry.summary[type]?.forEach((element) => {
        if (element.color) {
          const existingColor = colorsList.find(
            (c) =>
              c.r === element.color!.r &&
              c.g === element.color!.g &&
              c.b === element.color!.b
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
   * @param selection Selection
   */
  const onHighlight = useCallback(
    (selection: ISelect): void => {
      dispatch(highlight(selection))
    },
    [dispatch]
  )

  /**
   * On unhighlight
   */
  const onUnhighlight = useCallback((): void => {
    dispatch(unhighlight())
  }, [dispatch])

  /**
   * On select
   * @param selection Selection
   */
  const onSelect = useCallback(
    (selection: ISelect): void => {
      if (selected.find((s) => s.uuid === selection.uuid))
        dispatch(unselect(selection))
      else dispatch(select(selection))
    },
    [selected, dispatch]
  )

  /**
   * On color fitler
   * @param color Color
   */
  const onColorFilter = useCallback((color?: TGeometryColor): void => {
    setFilter(color)
  }, [])

  /**
   * On color fitler clear
   */
  const onColorFilterClear = useCallback((): void => {
    setFilter(undefined)
  }, [])

  /**
   * Select all
   */
  const selectAll = useCallback((): void => {
    geometry.summary[type!]?.forEach((element) => {
      if (
        !filter ||
        (filter &&
          filter.r === element.color?.r &&
          filter.g === element.color?.g &&
          filter.b === element.color?.b)
      )
        dispatch(
          select({
            uuid: element.uuid,
            label: element.label
          })
        )
    })
  }, [geometry, type, filter, dispatch])

  /**
   * Unselect all
   */
  const unselectAll = useCallback(() => {
    geometry.summary[type!]?.forEach((element) => {
      if (
        !filter ||
        (filter &&
          filter.r === element.color?.r &&
          filter.g === element.color?.g &&
          filter.b === element.color?.b)
      )
        dispatch(
          unselect({
            uuid: element.uuid,
            label: element.label
          })
        )
    })
  }, [geometry, type, filter, dispatch])

  /**
   * Swap selection
   */
  const selectSwap = useCallback(() => {
    geometry.summary[type!]?.forEach((element) => {
      if (
        !filter ||
        (filter &&
          filter.r === element.color?.r &&
          filter.g === element.color?.g &&
          filter.b === element.color?.b)
      ) {
        if (selected.find((s) => s.uuid === element.uuid))
          dispatch(
            unselect({
              uuid: element.uuid,
              label: element.label
            })
          )
        else
          dispatch(
            select({
              uuid: element.uuid,
              label: element.label
            })
          )
      } else {
        dispatch(
          select({
            uuid: element.uuid,
            label: element.label
          })
        )
      }
    })
  }, [geometry, selected, type, filter, dispatch])

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
      label: number
      name: string
      color?: TGeometryColor
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
    <Card size="small" css={globalStyle.noBorderBottom}>
      <Space direction="vertical" css={globalStyle.fullWidth}>
        <Typography.Text strong>Filters</Typography.Text>
        <Space direction="horizontal" wrap={true}>
          {colors.length > 1 && (
            <>
              <Tooltip title="Reset">
                <Button icon={<CloseOutlined />} onClick={onColorFilterClear} />
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
          suffix={<SearchOutlined css={globalStyle.textLight} />}
        />
      </Space>

      <div css={css([globalStyle.fullWidth, globalStyleFn.marginTop(20)])}>
        {type
          ? geometry.summary[type]?.map((element, index) => {
              if (display(element)) {
                let borderColor = 'transparent'
                let backgroundColor = 'transparent'
                if (selected.find((s) => s.uuid === element.uuid)) {
                  borderColor = '#EE9817'
                  backgroundColor = 'rgba(238, 152, 23, 0.3)'
                } else if (highlighted?.uuid === element.uuid) {
                  borderColor = '#FAD114'
                  backgroundColor = 'rgba(250, 209, 20, 0.3)'
                }

                return (
                  <Card
                    css={globalStyleFn.marginBottom(10)}
                    key={index}
                    bodyStyle={{
                      position: 'relative',
                      padding: '10px 10px 10px 40px',
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor,
                      backgroundColor
                    }}
                    onMouseEnter={() =>
                      onHighlight({
                        uuid: element.uuid,
                        label: element.label
                      })
                    }
                    onMouseLeave={onUnhighlight}
                    onClick={() =>
                      onSelect({
                        uuid: element.uuid,
                        label: element.label
                      })
                    }
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
            })
          : []}
      </div>
    </Card>
  )
}

export default Selector
