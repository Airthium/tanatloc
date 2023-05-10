/** @module Components.Project.Data */

import {
  useState,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction
} from 'react'
import {
  Button,
  Checkbox,
  Drawer,
  Dropdown,
  Layout,
  Space,
  Table,
  TableColumnsType,
  Tooltip
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
import { camelCase } from 'lodash'

import { IFrontSimulationsItem, IFrontSimulationTask } from '@/api/index.d'

import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import SimulationAPI from '@/api/simulation'

import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'name'>
}

export interface IColumnRenderProps {
  name: string
  index: number
  columnSelection: boolean[]
  setColumnSelection: Dispatch<SetStateAction<boolean[]>>
}

/**
 * Error
 */
export const errors = {
  download: 'Unable to download CSV'
}

/**
 * Export CSV
 * @param simulation Simulation
 * @param datas Datas
 * @param names Names
 * @param camelNames Camel names
 * @param separator Separator (Default to ;)
 */
export const _exportCSV = (
  simulation: Pick<IFrontSimulationsItem, 'name'>,
  datas: { key: number; x: number; [key: string]: number }[],
  names: string[],
  camelNames: string[],
  separator: string = ';'
): void => {
  let CSV = ''

  // Header
  CSV = 'x' + separator + names.join(separator) + '\n'

  // Data
  datas.forEach((data) => {
    CSV += data.x
    camelNames?.forEach((name) => {
      data[name] !== undefined && (CSV += separator + data[name])
    })
    CSV += '\n'
  })

  // Download
  const fileName = simulation.name + '.csv'
  const file = new File([CSV], fileName, { type: 'text/csv' })
  const url = window.URL.createObjectURL(file)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', fileName)
  link.click()
  link.remove()
}

const ColumnRender = ({
  name,
  index,
  columnSelection,
  setColumnSelection
}: IColumnRenderProps): React.JSX.Element => {
  /**
   * On change
   * @param event Event
   */
  const onChange = useCallback(
    (event: CheckboxChangeEvent): void => {
      const checked = event.target.checked

      const newSelection = [...columnSelection]
      newSelection[index] = checked

      setColumnSelection(newSelection)
    },
    [index, columnSelection, setColumnSelection]
  )

  /**
   * Render
   */
  return (
    <Space className={style.tableHead}>
      {name}
      <Checkbox
        data-testid="table-checkbox"
        checked={columnSelection[index]}
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
const Data = ({ simulation }: IProps): React.JSX.Element | null => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [datas, setDatas] =
    useState<{ key: number; x: number; [key: string]: number }[]>()
  const [title, setTitle] = useState<string>()
  const [names, setNames] = useState<string[]>()
  const [camelNames, setCamelNames] = useState<string[]>()
  const [columns, setColumns] = useState<TableColumnsType<object>>()
  const [columnSelection, setColumnSelection] = useState<boolean[]>([true])
  const [plot, setPlot] = useState<{
    data: { x: number }[]
    min: number
    max: number
    domainMin: number
    domainMax: number
    lines: React.JSX.Element[]
  }>()
  const [downloading, setDownloading] = useState<boolean>(false)

  // Data
  const [currentSimulation] = SimulationAPI.useSimulation(simulation?.id)

  // Datas
  useEffect(() => {
    const tasks = currentSimulation?.tasks

    if (!tasks) {
      setDatas(undefined)
      setNames(undefined)
      setCamelNames(undefined)
      return
    }

    // Get datas
    const tasksDatas: IFrontSimulationTask['datas'] = tasks
      .map((task) => task.datas)
      .filter((t) => t)
      .flatMap((t) => t)

    if (!tasksDatas.length || !tasksDatas[0].names) {
      setNames(undefined)
      setCamelNames(undefined)
      return
    }

    // Sort
    tasksDatas.sort((a, b) => a.x - b.x)

    const newTitle = tasksDatas[0].title

    const newNames = tasksDatas
      .map((data) => data.names)
      .flatMap((n) => n)
      .filter(
        (value, index, self) => self.findIndex((s) => s === value) === index
      )
    const newCamelNames = newNames.map((name: string) => camelCase(name))

    const newDatas: { key: number; x: number; [key: string]: number }[] = []
    tasksDatas.forEach((data, index) => {
      data.names.forEach((name, nameIndex) => {
        const existing = newDatas.find((d) => d.x === data.x)
        if (!existing) {
          newDatas.push({
            key: index,
            x: data.x,
            [camelCase(name)]: data.ys[nameIndex]
          })
        } else {
          existing[camelCase(name)] = data.ys[nameIndex]
        }
      })
    })

    setTitle(newTitle)
    setDatas(newDatas)
    setNames(newNames)
    setCamelNames(newCamelNames)
  }, [currentSimulation])

  // Table
  useEffect(() => {
    if (!datas || !names || !camelNames) {
      setColumns(undefined)
      return
    }

    const tableColumns: TableColumnsType<object> = names.map((name, index) => ({
      align: 'center',
      className: 'column' + (columnSelection[index] ? ' selected' : ''),
      title: (
        <ColumnRender
          name={name}
          index={index}
          columnSelection={columnSelection}
          setColumnSelection={setColumnSelection}
        />
      ),
      dataIndex: camelNames[index],
      key: camelNames[index]
    }))
    tableColumns.unshift({
      align: 'center',
      title: title ?? 'Iteration',
      dataIndex: 'x',
      key: 'x',
      fixed: 'left'
    })

    setColumns(tableColumns)
  }, [title, datas, names, camelNames, columnSelection])

  // Plot
  useEffect(() => {
    if (!datas || !names || !camelNames) {
      setPlot(undefined)
      return
    }

    // Set lines
    const keys: string[] = []
    const colors = Utils.colorGenerator(columnSelection.length)
    const lines = columnSelection
      .map((selection, index) => {
        if (!selection) return

        const key = camelNames[index]
        const name = names[index]
        const color = colors[index]
        keys.push(key)

        return (
          <Line
            key={key}
            name={name}
            type="monotone"
            dataKey={key}
            stroke={color}
            strokeWidth={2}
          />
        )
      })
      .filter((l) => l) as React.JSX.Element[]

    // Set data
    const data = datas
      .map((d) => {
        const part: { x: number; [key: string]: number } = { x: d.x }
        keys.forEach((key) => {
          d[key] && (part[key] = d[key])
        })
        return part
      })
      .filter((d) => d)

    const min = Math.min(...keys.flatMap((key) => data.map((d) => d[key])))
    const max = Math.max(...keys.flatMap((key) => data.map((d) => d[key])))
    const range = max - min
    const domainMin = min - range * 0.1
    const domainMax = max + range * 0.1

    setPlot({ data, min, max, domainMin, domainMax, lines })
  }, [datas, names, camelNames, columnSelection])

  /**
   * Set visible true
   */
  const setVisibleTrue = useCallback((): void => setVisible(true), [])

  /**
   * Set visible false
   */
  const setVisibleFalse = useCallback((): void => setVisible(false), [])

  /**
   * Export CSV (tab)
   */
  const exportCSVTab = useCallback((): void => {
    setDownloading(true)
    try {
      _exportCSV(simulation!, datas!, names!, camelNames!, '\t')
    } catch (err: any) {
      ErrorNotification(errors.download, err)
    } finally {
      setDownloading(false)
    }
  }, [simulation, datas, names, camelNames])

  /**
   * Export CSV comma
   */
  const exportCSVComma = useCallback((): void => {
    setDownloading(true)
    try {
      _exportCSV(simulation!, datas!, names!, camelNames!, ',')
    } catch (err: any) {
      ErrorNotification(errors.download, err)
    } finally {
      setDownloading(false)
    }
  }, [simulation, datas, names, camelNames])

  /**
   * Export CSV default
   */
  const exportCSVDefault = useCallback((): void => {
    setDownloading(true)
    try {
      _exportCSV(simulation!, datas!, names!, camelNames!)
    } catch (err: any) {
      ErrorNotification(errors.download, err)
    } finally {
      setDownloading(false)
    }
  }, [simulation, datas, names, camelNames])

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
  if (!datas || !names || !camelNames) return null
  return (
    <Layout className={style.data}>
      <Layout.Content>
        <Tooltip title="Data visualization">
          <Button
            type="primary"
            icon={<LineChartOutlined />}
            onClick={setVisibleTrue}
            className={style.button}
          />
        </Tooltip>

        <Drawer
          title="Data visualization"
          placement="bottom"
          closable={true}
          onClose={setVisibleFalse}
          open={visible}
          mask={false}
          maskClosable={false}
          height="50vh"
          bodyStyle={{ height: '100%', overflow: 'hidden' }}
          extra={
            <Dropdown.Button
              loading={downloading}
              disabled={!datas}
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
                dataSource={datas}
                columns={columns}
                scroll={{
                  x: ((columns?.length ? +columns.length : 1) - 1) * 200
                }}
              />
            </div>

            <ResponsiveContainer width="49%" height="100%">
              <LineChart
                data={plot?.data}
                margin={{ top: 0, right: 40, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={'x'} />
                <YAxis
                  domain={plot ? [plot.domainMin, plot.domainMax] : [-1, 1]}
                  tickFormatter={format}
                />
                <ReTooltip />
                <Legend />
                {plot?.lines}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Drawer>
      </Layout.Content>
    </Layout>
  )
}

export default Data
