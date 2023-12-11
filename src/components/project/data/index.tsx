/** @module Components.Project.Data */

import {
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  useContext,
  ReactNode,
  useMemo
} from 'react'
import {
  Checkbox,
  Drawer,
  Dropdown,
  Empty,
  Space,
  Table,
  TableColumnsType
} from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { LineChartOutlined } from '@ant-design/icons'
import {
  CartesianGrid,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis
} from 'recharts'

import { IFrontSimulation, IFrontSimulationsItem } from '@/api/index.d'
import { ISimulationTaskData } from '@/database/simulation/get'

import { NotificationContext } from '@/context/notification'
import { addError } from '@/context/notification/actions'
import { SelectContext } from '@/context/select'
import { setData } from '@/context/select/actions'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import style from './index.module.css'

/**
 * Props
 */
export type Simulation = Pick<IFrontSimulationsItem, 'id' | 'name'>
export interface IProps {
  simulation?: Simulation
}

export interface IColumnRenderProps {
  name: string
  index: number
  selection: boolean[]
  setSelection: Dispatch<SetStateAction<boolean[]>>
}

/**
 * Types
 */
export type RowData = {
  xName: string
  yNames: string[]
  points: {
    x: number
    [key: string]: number
  }[]
}

export type Plot = {
  data: { x: number }[]
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  lines: ReactNode[]
}

/**
 * Error
 */
export const errors = {
  download: 'Unable to download CSV'
}

/**
 * Export CSV
 * @param name Name
 * @param data Data
 * @param separator Separator (Default to ;)
 */
export const _exportCSV = (
  name: string,
  data: RowData,
  separator: string = ';'
): void => {
  let CSV = ''

  // Header
  CSV = 'x' + separator + data.yNames.join(separator) + '\n'

  // Data
  data.points.forEach((point) => {
    CSV += point.x
    data.yNames.forEach((name) => {
      CSV += separator + point[name]
    })
    CSV += '\n'
  })

  // Download
  const fileName = name + '.csv'
  const file = new File([CSV], fileName, { type: 'text/csv' })
  const url = window.URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  link.click()
  link.remove()
}

/**
 * Column
 * @param props Props
 * @returns Column
 */
const Column: React.FunctionComponent<IColumnRenderProps> = ({
  name,
  index,
  selection,
  setSelection
}) => {
  /**
   * On change
   * @param event Event
   */
  const onChange = useCallback(
    (event: CheckboxChangeEvent): void => {
      const checked = event.target.checked

      const newSelection = [...selection]
      newSelection[index] = checked

      setSelection(newSelection)
    },
    [index, selection, setSelection]
  )

  /**
   * Render
   */
  return (
    <Space className={style.tableHead}>
      {name}
      <Checkbox
        data-testid="table-checkbox"
        checked={selection[index]}
        onChange={onChange}
      >
        <LineChartOutlined style={{ fontSize: 20 }} />
      </Checkbox>
    </Space>
  )
}

/**
 * Data visualization
 * @param props Props
 * @returns Data
 */
const Data: React.FunctionComponent<IProps> = ({ simulation }) => {
  // State
  const [selection, setSelection] = useState<boolean[]>([true])
  const [downloading, setDownloading] = useState<boolean>(false)

  // Context
  const { data: dataDisplay, dispatch: selectDispatch } =
    useContext(SelectContext)
  const { dispatch } = useContext(NotificationContext)

  // Data
  const [currentSimulation] = SimulationAPI.useSimulation(simulation?.id)

  // Row data
  const data = useMemo(() => {
    if (currentSimulation.id === '0') return

    const validSimulation = currentSimulation as IFrontSimulation
    const tasks = validSimulation.tasks
    if (!tasks.length) return

    // Tasks data
    const taskData = tasks
      .map((task) => task.datas)
      .filter((t) => t)
      .flat() as ISimulationTaskData[]
    if (!taskData.length) return

    // Sort
    taskData.sort((a, b) => a.x - b.x)

    // Merge
    const xName = taskData[0].title
    let yNames: string[] = []
    taskData.forEach(
      (data) => (yNames = [...new Set([...yNames, ...data.names])])
    )
    const points = taskData.map((data) => {
      const point: RowData['points'][0] = {
        x: data.x
      }
      for (let i = 0; i < data.names.length; ++i) {
        const name = data.names[i]
        if (name === yNames[i]) point[name] = data.ys[i]
        else point[name] = 0
      }

      return point
    })

    const data: RowData = {
      xName,
      yNames,
      points
    }

    return data
  }, [currentSimulation])

  // Columns
  const columns = useMemo(() => {
    if (!data) return

    // Columns
    const columns: TableColumnsType<object> = data.yNames.map(
      (name, index) => ({
        key: name,
        dataIndex: name,
        title: (
          <Column
            name={name}
            index={index}
            selection={selection}
            setSelection={setSelection}
          />
        ),
        align: 'center'
      })
    )
    columns.unshift({
      key: 'x',
      dataIndex: 'x',
      title: data.xName,
      align: 'center',
      fixed: 'left'
    })

    return columns
  }, [data, selection, setSelection])

  // Plot
  const plot = useMemo(() => {
    if (!data) return

    // Lines
    const colors = Utils.colorGenerator(selection.length)
    const lines = selection
      .map((selection, index) => {
        if (!selection) return

        const name = data.yNames[index]
        const color = colors[index]

        return (
          <Line
            key={name}
            name={name}
            type="monotone"
            dataKey={name}
            stroke={color}
            strokeWidth={2}
          />
        )
      })
      .filter((l) => l)

    // Min / max
    const xs = data.points.map((point) => point.x)
    const xMin = Math.min(...xs)
    const xMax = Math.max(...xs)
    const ys = selection
      .map((selection, index) => {
        if (!selection) return

        const name = data.yNames[index]
        const ys = data.points.map((point) => point[name])
        return ys
      })
      .filter((ys) => ys)
      .flat() as number[]
    const yMin = Math.min(...ys)
    const yMax = Math.max(...ys)
    const range = yMax - yMin

    return {
      xMin,
      xMax,
      yMin: yMin - 0.1 * range,
      yMax: yMax + 0.1 * range,
      lines
    }
  }, [data, selection])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback(
    (): void => selectDispatch(setData(false)),
    [selectDispatch]
  )

  /**
   * Export CSV (tab)
   */
  const exportCSVTab = useCallback((): void => {
    setDownloading(true)
    try {
      _exportCSV(simulation?.name!, data!, '\t')
    } catch (err: any) {
      dispatch(addError({ title: errors.download, err }))
    } finally {
      setDownloading(false)
    }
  }, [simulation, data, dispatch])

  /**
   * Export CSV comma
   */
  const exportCSVComma = useCallback((): void => {
    setDownloading(true)
    try {
      _exportCSV(simulation?.name!, data!, ',')
    } catch (err: any) {
      dispatch(addError({ title: errors.download, err }))
    } finally {
      setDownloading(false)
    }
  }, [simulation, data, dispatch])

  /**
   * Export CSV default
   */
  const exportCSVDefault = useCallback((): void => {
    setDownloading(true)
    try {
      _exportCSV(simulation?.name!, data!)
    } catch (err: any) {
      dispatch(addError({ title: errors.download, err }))
    } finally {
      setDownloading(false)
    }
  }, [simulation?.name, data, dispatch])

  /**
   * Format
   * @param value Value
   */
  const format = useCallback(
    (value: any): string => Number(value).toExponential(3),
    []
  )

  /**
   * Render
   */
  if (!simulation) return null
  if (!data || !columns) return null
  return (
    <Drawer
      title="Data visualization"
      placement="bottom"
      closable={true}
      onClose={setVisibleFalse}
      open={dataDisplay}
      mask={false}
      maskClosable={false}
      height="50vh"
      styles={{ body: { height: '100%', overflow: 'hidden' } }}
      extra={
        <Dropdown.Button
          loading={downloading}
          menu={{
            items: [
              {
                label: 'Default separator: semicolon',
                key: 'semicolon',
                disabled: true
              },
              {
                label: 'Separator: tab',
                key: 'tab',
                onClick: exportCSVTab
              },
              {
                label: 'Separator: comma',
                key: ',',
                onClick: exportCSVComma
              }
            ]
          }}
          onClick={exportCSVDefault}
        >
          Export CSV
        </Dropdown.Button>
      }
    >
      <div className={style.container}>
        <div className={style.tableContainer}>
          <Table
            size="small"
            sticky={true}
            pagination={false}
            dataSource={data.points}
            columns={columns}
            scroll={{
              x: ((columns?.length ? +columns.length : 1) - 1) * 200
            }}
          />
        </div>

        <ResponsiveContainer width="49%" height="100%">
          {plot?.lines.length ? (
            <LineChart
              data={data.points}
              margin={{ top: 0, right: 40, left: 40, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={'x'} domain={[plot.xMin, plot.xMax]} />
              <YAxis domain={[plot.yMin, plot.yMax]} tickFormatter={format} />
              <ReTooltip />
              <Legend />
              {plot.lines}
            </LineChart>
          ) : (
            <Empty description="No data to display" />
          )}
        </ResponsiveContainer>
      </div>
    </Drawer>
  )
}

export default Data
