import { useCallback, useEffect, useRef } from 'react'
import dynamic from 'next/dynamic'
import SplitPane from 'react-split-pane'
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

const Code = (): JSX.Element => {
  const containerRef = useRef<HTMLDivElement>(null)

  const onWindowResize = useCallback(() => {
    if (!containerRef.current) return
  }, [])

  useEffect(() => {
    window.addEventListener('resize', onWindowResize)
    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [onWindowResize])

  return (
    <div ref={containerRef} className={style.code}>
      <SplitPane
        split="vertical"
        minSize={200}
        maxSize={-200}
        style={{ position: 'unset' }}
        size={'50%'}
        {...({} as any)}
      >
        <FreeFEMCode />
        <JSONCode />
      </SplitPane>
    </div>
  )
}

export default Code
