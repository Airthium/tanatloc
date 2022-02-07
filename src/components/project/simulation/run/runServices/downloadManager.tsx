import ResultAPI from '@/api/result'
import { Error as ErrorNotification } from '@/components/assets/notification'
import { ISimulation } from '@/database/index.d'

const onArchiveDownloadSetup = async (
  downloading: string[],
  setDownloading: Function,
  simulation: ISimulation
) => {
  setDownloading([...downloading, 'archive'])

  try {
    const archive = await ResultAPI.archive({ id: simulation.id })
    const content = await archive.blob()

    const url = window.URL.createObjectURL(new Blob([content]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', simulation.scheme.name + '.zip')
    link.click()
  } catch (err) {
    ErrorNotification('Unable to download the file', err)
  } finally {
    setDownloading((d) => {
      const index = d.indexOf('archive')
      return [...d.slice(0, index), ...d.slice(index + 1)]
    })
  }
}

/**
 * On download
 * @param {Object} file Result file
 */
const onDownloadSetup = async (
  file,
  downloading: string[],
  setDownloading: Function,
  simulation: ISimulation
) => {
  setDownloading([...downloading, file.glb])

  try {
    const content = await ResultAPI.download(
      { id: simulation.id },
      { originPath: file.originPath, fileName: file.fileName }
    )
    const blob = await content.blob()

    const url = window.URL.createObjectURL(new Blob([blob]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute(
      'download',
      file.name + '.' + file.fileName.split('.').pop()
    )
    link.click()
  } catch (err) {
    ErrorNotification('Unable to download the file', err)
  } finally {
    setDownloading((d) => {
      const index = d.indexOf(file.glb)
      return [...d.slice(0, index), ...d.slice(index + 1)]
    })
  }
}

export { onArchiveDownloadSetup, onDownloadSetup }
