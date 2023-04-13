/** @module Components.Editor.Code */

import dynamic from 'next/dynamic'

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
    <div className={style.code}>
      <FreeFEMCode />
      <JSONCode />
    </div>
  )
}

export default Code
