import { useCallback, useEffect, useRef, useState } from 'react'

import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  className?: string
  leftChild: JSX.Element
  rightChild: JSX.Element
}

/**
 * Divider props
 */
export interface IDividerProps {
  onMove: (x: number) => void
  onDoubleClick: () => void
}

/**
 * Rect
 */
export interface IRect {
  left: number
  width: number
}

/**
 * Divider
 * @returns Divider
 */
export const Divider = ({
  onMove,
  onDoubleClick
}: IDividerProps): JSX.Element => {
  // State
  const [activated, setActivated] = useState<boolean>(false)

  /**
   * On mouse down
   */
  const onMouseDown = useCallback(() => {
    setActivated(true)
  }, [])

  /**
   * On mouse move
   * @param e Event
   */
  const onMouseMove = useCallback(
    (e: MouseEvent): void => {
      if (activated) {
        e.preventDefault()
        onMove(e.clientX)
      }
    },
    [activated, onMove]
  )

  /**
   * On mouse up
   */
  const onMouseUp = useCallback(() => {
    setActivated(false)
  }, [])

  // Init
  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
    }
  })

  /**
   * Render
   */
  return (
    <div
      className={style.divider}
      onMouseDown={onMouseDown}
      onDoubleClick={onDoubleClick}
    />
  )
}

/**
 * Side panels
 * @param props Props
 * @returns SidePanels
 */
const SidePanels = ({
  className,
  leftChild,
  rightChild
}: IProps): JSX.Element => {
  // Ref
  const containerRef = useRef<HTMLDivElement>(null)

  // State
  const [containerRect, setContainerRect] = useState<IRect>()
  const [leftWidth, setLeftWidth] = useState<number>()
  const [rightWidth, setRightWidth] = useState<number>()

  /**
   * On resize
   */
  const onResize = useCallback((): void => {
    if (!containerRef.current) return

    const rect = containerRef.current.getBoundingClientRect()
    setContainerRect({
      left: rect.left,
      width: rect.width
    })

    setLeftWidth((rect.width - 5) / 2)
    setRightWidth((rect.width - 5) / 2)
  }, [])

  /**
   * On move
   * @param x X
   */
  const onMove = useCallback(
    (x: number): void => {
      if (!containerRef.current) return
      if (!containerRect) return

      let leftWidth = x - containerRect.left
      let rightWidth = containerRect.width - x + containerRect.left

      if (leftWidth < 50) {
        leftWidth = 0
        rightWidth = containerRect.width - 5
      } else if (rightWidth < 50) {
        rightWidth = 0
        leftWidth = containerRect.width - 5
      }

      setLeftWidth(leftWidth)
      setRightWidth(rightWidth)
    },
    [containerRect]
  )

  // Init
  useEffect(() => {
    window.addEventListener('resize', onResize)
    setTimeout(onResize, 500)

    return () => {
      window.removeEventListener('resize', onResize)
    }
  }, [onResize])

  /**
   * Render
   */
  return (
    <div ref={containerRef} className={`${style.container} ${className ?? ''}`}>
      <div style={{ width: leftWidth }}>{leftChild}</div>
      <Divider onMove={onMove} onDoubleClick={onResize} />
      <div style={{ width: rightWidth }}>{rightChild}</div>
    </div>
  )
}

export default SidePanels
