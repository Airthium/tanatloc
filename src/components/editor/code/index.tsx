import dynamic from 'next/dynamic'

import SidePanels from '@/components/assets/sidePanels'

import style from '../index.module.css'

const FreeFEMCode = dynamic(
  () =>
    import('./freefem').catch((err) => {
      const ErrorComponent = () => (
        <div>
          <p>Unable to load FreeFEM-EJS editor</p>
          <p>{err.message}</p>
        </div>
      )
      return ErrorComponent
    }),
  { ssr: false }
)
const JSONCode = dynamic(
  () =>
    import('./json').catch((err) => {
      const ErrorComponent = () => (
        <div>
          <p>Unable to load JSON editor</p>
          <p>{err.message}</p>
        </div>
      )
      return ErrorComponent
    }),
  { ssr: false }
)

/**
 * Code
 * @returns Code
 */
const Code = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <SidePanels
      className={style.code}
      leftChild={<FreeFEMCode />}
      rightChild={<JSONCode />}
    ></SidePanels>
  )
}

export default Code
