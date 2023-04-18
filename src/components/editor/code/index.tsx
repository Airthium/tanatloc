/** @module Components.Editor.Code */

import { SyntheticEvent, useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { ResizableBox, ResizeCallbackData } from 'react-resizable'

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
  // Ref
  const containerRef = useRef<HTMLDivElement>(null)

  // State
  const [width, setWidth] = useState<number>(0)
  const [constraints, setConstraints] = useState<{ min: number; max: number }>({
    min: 200,
    max: 200
  })

  /**
   * On resize
   *
   */
  const onResize = useCallback(
    (_event: SyntheticEvent, { size }: ResizeCallbackData): void =>
      setWidth(size.width),
    []
  )

  /**
   * On window resize
   */
  const onWindowResize = useCallback(() => {
    /* istanbul ignore next */
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    const middle = rect.width / 2

    setWidth(middle)
    setConstraints({ min: 200, max: rect.width - 200 })
  }, [])

  // Handle window resize
  useEffect((): (() => void) => {
    window.addEventListener('resize', onWindowResize)
    setTimeout(onWindowResize, 500)
    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [onWindowResize])

  /**
   * Render
   */
  return (
    <div ref={containerRef} className={style.code}>
      <ResizableBox
        axis="x"
        width={width}
        minConstraints={[constraints.min, 0]}
        maxConstraints={[constraints.max, 0]}
        handle={<div className="handler" onDoubleClick={onWindowResize} />}
        onResize={onResize}
      >
        <FreeFEMCode />
      </ResizableBox>
      <div>
        <JSONCode />
      </div>
    </div>
  )
}

export default Code
