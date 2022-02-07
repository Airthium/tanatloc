import { ISimulation } from '@/database/index.d'
import { useState } from 'react'
import { Error as ErrorNotification } from '@/components/assets/notification'
import ResultAPI from '@/api/result'
import SimulationAPI from '@/api/simulation'


function checkInProgressTasks(
  currentSimulation: ISimulation,
  setRunning: Function
) {
  try {
    if (currentSimulation.tasks.find((t) => t?.status === 'error')) {
      setRunning(false)
    } else if (currentSimulation.tasks.find((t) => t?.status !== 'finish')) {
      setRunning(true)
    } else setRunning(false)
  } catch (error) {
    setRunning(false)
  }
}

function getUniqueNumbers(filteredFiles, filter) {
  const files = filteredFiles.map((file) => {
    const number = file.fileName
      .replace(new RegExp(filter.prefixPattern), '')
      .replace(new RegExp(filter.suffixPattern), '')
    return {
      ...file,
      number: +number
    }
  })

  // Get unique numbers
  return {
    files: files,
    numbers : files
    .sort((a, b) => a.number - b.number)
    .map((file) => file.number)
    .filter((value, i, self) => self.indexOf(value) === i)
  }
}


function setMultiplicator(filter, configuration) {
    // Multiplicator

    const multiplicatorPath = filter.multiplicator
    if (multiplicatorPath) {
      const multiplicatorObject = multiplicatorPath.reduce(
        (a, v) => a[v],
        configuration
      )
      return multiplicatorObject.value || multiplicatorObject.default
    }
}

const onCloudServer = async (cloudServer, currentSimulation, configuration, simulation, mutateSimulation, errors, swr) => {
    try {
      // New simulation
      const newSimulation = { ...currentSimulation }

      // Update local
      configuration.run.cloudServer = cloudServer
      newSimulation.scheme.configuration = configuration

      // API
      await SimulationAPI.update({ id: simulation.id }, [
        {
          key: 'scheme',
          type: 'json',
          method: 'set',
          path: ['configuration', 'run'],
          value: configuration.run
        }
      ])

      // Local
      swr.mutateOneSimulation(newSimulation)
      mutateSimulation(newSimulation)
    } catch (err) {
      ErrorNotification(errors.updateError, err)
    }
  }

export { checkInProgressTasks, getUniqueNumbers, setMultiplicator}




























// /**
//  * On download
//  * @param {Object} file Result file
//  */
// async function onDownload(file, simulation, errors) {
//const [downloading, setDownloading]: [string[], Function] = useState([])
//   setDownloading([...downloading, file.glb])

//   try {
//     const content = await ResultAPI.download(
//       { id: simulation.id },
//       { originPath: file.originPath, fileName: file.fileName }
//     )
//     const blob = await content.blob()

//     const url = window.URL.createObjectURL(new Blob([blob]))
//     const link = document.createElement('a')
//     link.href = url
//     link.setAttribute(
//       'download',
//       file.name + '.' + file.fileName.split('.').pop()
//     )
//     link.click()
//   } catch (err) {
//     ErrorNotification(errors.downloadError, err)
//   } finally {
//     setDownloading((d) => {
//       const index = d.indexOf(file.glb)
//       return [...d.slice(0, index), ...d.slice(index + 1)]
//     })
//   }
// }

// const getLog = async (link, setLogLoading, simulation, errors) => {
//   setLogLoading(true)

//   try {
//     const res = await SimulationAPI.log({ id: simulation.id }, link)
//     const log = Buffer.from(res.log).toString()

//     Modal.info({
//       title: 'System log',
//       width: 'unset',
//       content: (
//         <Typography.Paragraph code copyable>
//           {parse(log.replace(/\n\n/g, '\n').replace(/\n/g, '<br />'))}
//         </Typography.Paragraph>
//       )
//     })
//   } catch (err) {
//     ErrorNotification(errors.logError, err)
//   } finally {
//     setLogLoading(false)
//   }
// }

// /**
//  * On log
//  * @param {Object} task Task
//  * @param {string} title Tab title
//  */
// const onLog = (task, title, setLogLoading, simulation, errors) => {
//   // Content
//   const content = (
//     <Tabs.TabPane tab={title}>
//       {task?.systemLog && (
//         <Button
//           loading={logLoading}
//           onClick={() =>
//             getLog(task.systemLog, setLogLoading, simulation, errors)
//           }
//         >
//           Complete log
//         </Button>
//       )}
//       {parse(task?.log?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') || '')}
//       {parse(
//         task?.warning?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') || ''
//       )}
//       {parse(
//         task?.error?.replace(/\n\n/g, '\n').replace(/\n/g, '<br />') || ''
//       )}
//     </Tabs.TabPane>
//   )
//   setLogContent(<Tabs>{content}</Tabs>)

//   // Open
//   toggleLog()
// }

// /**
//  * On run
//  */
// const onRun = async () => {
//   setRunning(true)

//   try {
//     await SimulationAPI.run({ id: simulation.id })
//   } catch (err) {
//     ErrorNotification(errors.runError, err)
//   }
// }

// /**
//  * On stop
//  */
// const onStop = async () => {
//   try {
//     await SimulationAPI.stop({ id: simulation.id })

//     setRunning(false)
//   } catch (err) {
//     ErrorNotification(errors.stopError, err)
//   }
// }
