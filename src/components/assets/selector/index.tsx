/** @module Components.Assets.Selector */

import {
  ChangeEvent,
  useState,
  useCallback,
  useContext,
  Dispatch,
  SetStateAction,
  useMemo
} from 'react'
import { Button, Card, Input, Space, Tag, Tooltip, Typography } from 'antd'
import {
  CloseOutlined,
  CloseSquareOutlined,
  PlusSquareOutlined,
  SearchOutlined,
  SwapOutlined
} from '@ant-design/icons'

import { IFrontGeometriesItem } from '@/api/index.d'
import { TGeometryColor } from '@/database/geometry/get'

import { SelectContext, ISelect, ISelectAction } from '@/context/select'
import { highlight, select } from '@/context/select/actions'
import {
  addOrRemoveSelection,
  addSelections,
  removeSelections,
  swapSelections
} from '@/context/select/helpers'

import useCustomEffect from '@/components/utils/useCustomEffect'

import Utils from '@/lib/utils'

import globalStyle from '@/styles/index.module.css'

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

export interface IColorFilterProps {
  color: TGeometryColor
  setFilter: Dispatch<SetStateAction<TGeometryColor | undefined>>
}

export interface IColorFiltersProps {
  colors: TGeometryColor[]
  setFilter: Dispatch<SetStateAction<TGeometryColor | undefined>>
}

export interface IGeometryElementCardProps {
  element: {
    name: string
    uuid: string
    label: number
    color?: TGeometryColor
  }
  alreadySelected?: ISelection[]
  filter?: TGeometryColor
  search?: string
  context: {
    selected: ISelect[]
    highlighted: ISelect | undefined
    dispatch: Dispatch<ISelectAction>
  }
}

/**
 * ColorFilter
 * @param props Props
 * @returns ColorFilter
 */
const ColorFilter: React.FunctionComponent<IColorFilterProps> = ({
  color,
  setFilter
}) => {
  /**
   * On color fitler
   * @param color Color
   */
  const onColorFilter = useCallback((): void => {
    setFilter(color)
  }, [color, setFilter])

  /**
   * Render
   */
  return (
    <Tooltip title="Color">
      <Button
        style={{ backgroundColor: Utils.rgbToHex(color) }}
        onClick={onColorFilter}
      >
        {' '}
      </Button>
    </Tooltip>
  )
}

/**
 * ColorFilters
 * @param props Props
 * @returns ColorFilters
 */
const ColorFilters: React.FunctionComponent<IColorFiltersProps> = ({
  colors,
  setFilter
}) => {
  /**
   * On color fitler clear
   */
  const onColorFilterClear = useCallback((): void => {
    setFilter(undefined)
  }, [setFilter])

  /**
   * Render
   */
  return (
    colors.length > 1 && (
      <>
        <Tooltip title="Reset">
          <Button icon={<CloseOutlined />} onClick={onColorFilterClear} />
        </Tooltip>
        {colors.map((color) => (
          <ColorFilter
            key={JSON.stringify(color)}
            color={color}
            setFilter={setFilter}
          />
        ))}
      </>
    )
  )
}

/**
 * GeometryElementCard
 * @param props Props
 * @returns GeometryElementCard
 */
const GeometryElementCard: React.FunctionComponent<
  IGeometryElementCardProps
> = ({ element, alreadySelected, filter, search, context }) => {
  /**
   * Display?
   * @param element Element
   * @returns True/false
   */
  const display = useMemo(() => {
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
  }, [element, filter, search])

  // Border color
  const borderColor = useMemo(() => {
    if (context.selected.find((s) => s.uuid === element.uuid)) return '#EE9817'
    else if (context.highlighted?.uuid === element.uuid) return '#FAD114'
    return 'transparent'
  }, [element, context])

  // Background color
  const backgroundColor = useMemo(() => {
    if (context.selected.find((s) => s.uuid === element.uuid))
      return 'rgba(238, 152, 23, 0.3)'
    else if (context.highlighted?.uuid === element.uuid)
      return 'rgba(250, 209, 20, 0.3)'
    return 'transparent'
  }, [element, context])

  /**
   * On highglight
   * @param selection Selection
   */
  const onHighlight = useCallback(
    (selection: ISelect): void => {
      context.dispatch(highlight(selection))
    },
    [context]
  )

  /**
   * On unhighlight
   */
  const onUnhighlight = useCallback((): void => {
    context.dispatch(highlight())
  }, [context])

  /**
   * On select
   * @param selection Selection
   */
  const onSelect = useCallback(
    (selection: ISelect): void => {
      const selected = addOrRemoveSelection(context.selected, selection)
      context.dispatch(select(selected))
    },
    [context]
  )

  /**
   * On mouse enter
   */
  const onMouseEnter = useCallback(
    (): void =>
      onHighlight({
        uuid: element.uuid,
        label: element.label
      }),
    [element, onHighlight]
  )

  /**
   * On click
   */
  const onClick = useCallback(
    (): void =>
      onSelect({
        uuid: element.uuid,
        label: element.label
      }),
    [element, onSelect]
  )

  /**
   * Render
   */
  if (display)
    return (
      <Card
        style={{ marginBottom: '10px' }}
        bodyStyle={{
          position: 'relative',
          padding: '10px 10px 10px 40px',
          borderWidth: '2px',
          borderStyle: 'solid',
          borderColor,
          backgroundColor
        }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onUnhighlight}
        onClick={onClick}
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
                  key={element.uuid + a.label}
                  color={Utils.stringToColor(a.label)}
                >
                  {a.label}
                </Tag>
              )
          })}
        </Space>
      </Card>
    )
  return null
}

/**
 * Selector
 * @param props Props
 * @description Props list:
 * - alreadySelected (Array) Already selected
 * - updateSelected (Function) Update selected
 * @returns Selector
 */
const Selector: React.FunctionComponent<IProps> = ({
  geometry,
  alreadySelected,
  updateSelected
}) => {
  // State
  const [filter, setFilter] = useState<TGeometryColor>()
  const [search, setSearch] = useState<string>()

  // Context
  const { type, highlighted, selected, dispatch } = useContext(SelectContext)

  // Selected
  useCustomEffect(() => updateSelected(selected), [selected], [updateSelected])

  // Colors
  const colors = useMemo(() => {
    const colors: TGeometryColor[] = []
    if (type)
      geometry.summary[type]?.forEach((element) => {
        if (element.color) {
          const existingColor = colors.find(
            (c) =>
              c.r === element.color!.r &&
              c.g === element.color!.g &&
              c.b === element.color!.b
          )
          if (!existingColor) {
            colors.push(element.color)
          }
        }
      })
    return colors
  }, [geometry, type])

  /**
   * Select all
   */
  const selectAll = useCallback((): void => {
    const toAdd =
      (geometry.summary[type!]
        ?.map((element) => {
          if (
            !filter ||
            (filter &&
              filter.r === element.color?.r &&
              filter.g === element.color?.g &&
              filter.b === element.color?.b)
          )
            return { uuid: element.uuid, label: element.label }
        })
        .filter((s) => s) as ISelect[]) ?? []
    const newSelected = addSelections(selected, toAdd)
    dispatch(select(newSelected))
  }, [geometry, type, selected, filter, dispatch])

  /**
   * Unselect all
   */
  const unselectAll = useCallback(() => {
    const toRemove =
      (geometry.summary[type!]
        ?.map((element) => {
          if (
            !filter ||
            (filter &&
              filter.r === element.color?.r &&
              filter.g === element.color?.g &&
              filter.b === element.color?.b)
          )
            return {
              uuid: element.uuid,
              label: element.label
            }
        })
        .filter((s) => s) as ISelect[]) ?? []
    const newSelected = removeSelections(selected, toRemove)
    dispatch(select(newSelected))
  }, [geometry, type, selected, filter, dispatch])

  /**
   * Swap selection
   */
  const selectSwap = useCallback(() => {
    const toSwap =
      (geometry.summary[type!]
        ?.map((element) => {
          if (
            !filter ||
            (filter &&
              filter.r === element.color?.r &&
              filter.g === element.color?.g &&
              filter.b === element.color?.b)
          )
            return {
              uuid: element.uuid,
              label: element.label
            }
        })
        .filter((s) => s) as ISelect[]) ?? []
    const newSelected = swapSelections(selected, toSwap)
    dispatch(select(newSelected))
  }, [geometry, type, selected, filter, dispatch])

  /**
   * On search
   * @param e Event
   */
  const onSearch = useCallback((e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value
    setSearch(value)
  }, [])

  /**
   * Render
   */
  return (
    <Card size="small" className={globalStyle.noBorderBottom}>
      <Space direction="vertical" className={globalStyle.fullWidth}>
        <Typography.Text strong>Filters</Typography.Text>
        <Space direction="horizontal" wrap={true}>
          <ColorFilters colors={colors} setFilter={setFilter} />
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
          suffix={<SearchOutlined className={globalStyle.textLight} />}
        />
      </Space>

      <div className={globalStyle.fullWidth} style={{ marginTop: '20px' }}>
        {type
          ? geometry.summary[type]?.map((element) => (
              <GeometryElementCard
                key={element.uuid}
                element={element}
                alreadySelected={alreadySelected}
                filter={filter}
                search={search}
                context={{
                  selected,
                  highlighted,
                  dispatch
                }}
              />
            ))
          : null}
      </div>
    </Card>
  )
}

export default Selector
