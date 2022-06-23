/** @module Components.Project.Data */

import { useState, useEffect } from 'react'
import {
  Button,
  Checkbox,
  Drawer,
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

import { DownloadButton } from '@/components/assets/button'
import { ErrorNotification } from '@/components/assets/notification'

import Utils from '@/lib/utils'

import { IFrontSimulationsItem, IFrontSimulationTask } from '@/api/index.d'
import SimulationAPI from '@/api/simulation'

/**
 * Props
 */
export interface IProps {
  simulation?: Pick<IFrontSimulationsItem, 'id' | 'name'>
}

/**
 * Error
 */
export const errors = {
  download: 'Unable to download CSV'
}

/**
 * On check
 * @param event Event
 * @param index Index
 * @param columnSelection Column selection
 */
export const onCheck = (
  event: CheckboxChangeEvent,
  index: number,
  columnSelection: { checked: boolean }[]
): { checked: boolean }[] => {
  const checked = event.target.checked

  const newSelection = [...columnSelection]
  newSelection[index] = {
    checked
  }
  return newSelection
}

/**
 * Export CSV
 * @param simulation Simulation
 * @param table Table
 * @param infos Infos
 */
export const exportCSV = (
  simulation: Pick<IFrontSimulationsItem, 'name'>,
  table: { columns: TableColumnsType<object>; data: Array<any> },
  infos: {
    names: string[]
    camelNames: string[]
  }
): void => {
  const separator = ','
  let CSV = ''

  const tableData = table?.data

  // Header
  CSV = 'x' + separator + infos.names.join(separator) + '\n'

  // Data
  tableData.forEach((data) => {
    CSV += data.x
    infos?.camelNames?.forEach((name) => {
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

/**
 * Data visualization
 * @param props Props
 * @returns Data
 */
const Data = ({ simulation }: IProps): JSX.Element | null => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [infos, setInfos] = useState<{
    names: string[]
    camelNames: string[]
  }>()
  const [table, setTable] = useState<{
    columns: TableColumnsType<object>
    data: any[]
  }>()
  // { key: number; x: number; [key: string]: number }[]
  const [columnSelection, setColumnSelection] = useState<
    { checked: boolean }[]
  >([])
  const [plot, setPlot] = useState<{
    data: { x: number }[]
    min: number
    max: number
    lines: JSX.Element[]
  }>()
  const [downloading, setDownloading] = useState<boolean>(false)

  // Data
  const [currentSimulation] = SimulationAPI.useSimulation(simulation?.id)

  // Table
  useEffect(() => {
    const tasks = currentSimulation?.tasks

    if (tasks) {
      // Get tasks data
      const tasksData: IFrontSimulationTask['datas'] = []
      tasks.forEach((task) => {
        if (task?.datas) tasksData.push(...task.datas)
      })

      if (!tasksData.length) return

      // Aggregate data
      tasksData.sort((a, b) => a.x - b.x)

      if (!tasksData[0].names) return

      const names = tasksData[0].names
      const camelNames = names.map((n) => camelCase(n))

      const tableColumns: TableColumnsType<object> = names.map(
        (name, index) => ({
          align: 'center',
          title: (
            <Space>
              {name}
              <Checkbox
                checked={columnSelection[index]?.checked}
                onChange={(event) =>
                  setColumnSelection(onCheck(event, index, columnSelection))
                }
              >
                <LineChartOutlined />
              </Checkbox>
            </Space>
          ),
          dataIndex: camelNames[index],
          key: camelNames[index]
        })
      )
      tableColumns.unshift({
        title: '',
        dataIndex: 'x',
        key: 'x'
      })

      const tableData = tasksData.map((data, index) => {
        const ys: { [key: string]: number } = {}
        data.names.forEach((_, nameIndex) => {
          ys[camelNames[nameIndex]] = data.ys[nameIndex]
        })

        return {
          key: index,
          x: data.x,
          ...ys
        }
      })

      setInfos({ names, camelNames })
      setTable({ columns: tableColumns, data: tableData })
    }
  }, [currentSimulation?.tasks, columnSelection])

  // Plot
  useEffect(() => {
    const tableData = table?.data
    if (!infos || !tableData?.length) return

    // Set lines
    const keys: string[] = []
    const lines = columnSelection
      .map((selection, index) => {
        if (!selection?.checked) return

        const key = infos.camelNames[index]
        const name = infos.names[index]

        keys.push(key)

        return (
          <Line
            key={index}
            name={name}
            type="monotone"
            dataKey={key}
            stroke={Utils.stringToColor(key)}
            strokeWidth={2}
          />
        )
      })
      .filter((l) => l) as JSX.Element[]

    // Set data
    const data = tableData
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

    setPlot({ data, min, max, lines })
  }, [table?.data, columnSelection, infos])

  /**
   * Render
   */
  if (!simulation) return null
  if (!table?.data?.length) return null
  return (
    <Layout
      style={{
        position: 'absolute',
        zIndex: 100,
        right: 50,
        bottom: 25,
        backgroundColor: 'rgba(255, 255, 255, 0)'
      }}
    >
      <Layout.Content>
        <Tooltip title="Data visualization">
          <Button
            type="primary"
            icon={<LineChartOutlined />}
            onClick={() => setVisible(true)}
            style={{
              width: 40,
              height: 40,
              border: '1px solid #5E14FA',
              borderRadius: 20,
              marginBottom: -20
            }}
          />
        </Tooltip>

        <Drawer
          title="Data visualization"
          placement="bottom"
          closable={true}
          onClose={() => setVisible(false)}
          visible={visible}
          mask={false}
          maskClosable={false}
          height="50vh"
          bodyStyle={{ height: '100%', overflow: 'hidden' }}
        >
          <div style={{ display: 'flex', height: '100%' }}>
            <div style={{ height: '100%', width: '50%' }}>
              <DownloadButton
                loading={downloading}
                disabled={!infos || !table}
                onDownload={() => {
                  setDownloading(true)
                  try {
                    exportCSV(simulation, table, infos!)
                  } catch (err) {
                    ErrorNotification(errors.download, err)
                  } finally {
                    setDownloading(false)
                  }
                }}
              >
                Export CSV
              </DownloadButton>
              <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
                <Table
                  size="small"
                  dataSource={table?.data}
                  columns={table?.columns}
                  pagination={false}
                />
              </div>
            </div>

            <ResponsiveContainer width="50%" height="100%">
              <LineChart
                data={plot?.data}
                margin={{ top: 0, right: 40, left: 40, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey={'x'} />
                <YAxis domain={[plot?.min || -1, plot?.max || 1]} />
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
