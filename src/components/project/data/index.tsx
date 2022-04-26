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
import { LineChartOutlined, UpOutlined } from '@ant-design/icons'
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
import Loading from '@/components/loading'

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
const Data = ({ simulation }: IProps): JSX.Element => {
  // State
  const [visible, setVisible] = useState<boolean>(false)
  const [infos, setInfos] = useState<{
    names: string[]
    camelNames: string[]
  }>()
  const [table, setTable] = useState<{
    columns: TableColumnsType<object>
    data: { key: number; x: number; [key: string]: number }[]
  }>()
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

  // Data effect
  useEffect(() => {
    const tasks = currentSimulation?.tasks

    if (tasks) {
      // Get tasks data
      const tasksData: IFrontSimulationTask['datas'] = []
      tasks.forEach((task) => {
        if (task?.datas) tasksData.push(...task.datas)
      })

      // Aggregate data
      tasksData.sort((a, b) => a.x - b.x)

      const names = tasksData
        .filter(
          (value, index, self) =>
            self.findIndex((s) => s.name === value.name) === index
        )
        .map((d) => d.name)

      const camelNames = names.map((n) => camelCase(n))

      const tableColumns: TableColumnsType<object> = names.map((n, index) => ({
        align: 'center',
        title: (
          <Space>
            {n}
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
      }))
      tableColumns.unshift({
        title: '',
        dataIndex: 'x',
        key: 'x'
      })

      const tableData: { key: number; x: number; [key: string]: number }[] = []
      tasksData.forEach((d, index) => {
        const existingIndex = tableData.findIndex((t) => t.x === d.x)
        if (existingIndex === -1)
          tableData.push({
            key: index,
            x: d.x,
            [camelCase(d.name)]: d.y
          })
        else {
          tableData[existingIndex] = {
            ...tableData[existingIndex],
            [camelCase(d.name)]: d.y
          }
        }
      })

      setInfos({ names, camelNames })
      setTable({ columns: tableColumns, data: tableData })
    }
  }, [currentSimulation?.tasks, columnSelection])

  // Check effect
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
  if (!simulation) return <Loading.Simple />
  return (
    <Layout
      style={{
        position: 'absolute',
        zIndex: 100,
        bottom: -15,
        left: 'calc(50vw - 16px)',
        backgroundColor: 'rgba(255, 255, 255, 0)'
      }}
    >
      <Layout.Content>
        <Tooltip title="Data visualization">
          <Button
            disabled={!table?.data}
            type="primary"
            icon={
              <UpOutlined
                style={{ fontSize: 24, position: 'absolute', top: 2, left: 28 }}
              />
            }
            onClick={() => setVisible(true)}
            style={{
              width: 80,
              height: 80,
              border: '1ps solid gray',
              borderRadius: 40,
              marginBottom: -40
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
                    exportCSV(simulation, table!, infos!)
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
