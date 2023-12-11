/** @module Components.Assets.Carousel */

import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Carousel as AntCarousel } from 'antd'
import { CarouselRef } from 'antd/es/carousel'
import {
  LeftOutlined,
  RightOutlined,
  ZoomInOutlined,
  ZoomOutOutlined
} from '@ant-design/icons'

import style from './index.module.css'

/**
 * Props
 */
export interface IProps {
  items: {
    key: string
    src: string
    caption?: string
    alt?: string
  }[]
}

/**
 * Carousel
 * @param props Props
 * @returns Carousel
 */
const Carousel: React.FunctionComponent<IProps> = ({ items }) => {
  // Ref
  const carouselRef = useRef<CarouselRef>(null)

  // State
  const [zoom, setZoom] = useState<boolean>()
  const [displayCount, setDisplayCount] = useState<boolean>()

  useEffect(() => {
    if (displayCount) setTimeout(() => setDisplayCount(false), 2_000)
  }, [displayCount])

  /**
   * Next
   */
  const next = useCallback(() => {
    /* istanbul ignore next*/
    if (!carouselRef.current) return

    carouselRef.current.next()
    setDisplayCount(true)
  }, [])

  /**
   * Previous
   */
  const previous = useCallback(() => {
    /* istanbul ignore next*/
    if (!carouselRef.current) return

    carouselRef.current.prev()
    setDisplayCount(true)
  }, [])

  /**
   * Zoom in
   */
  const zoomIn = useCallback(() => {
    setZoom(true)
  }, [])

  /**
   * Zoom out
   */
  const zoomOut = useCallback(() => {
    setZoom(false)
  }, [])

  /**
   * Render
   */
  return (
    <div className={style.carouselContainer}>
      <div className={zoom ? style.fullCarousel : style.carousel}>
        <AntCarousel ref={carouselRef} effect="fade" dots={false}>
          {items.map((item, index) => (
            <div key={item.key} className={style.oneImage}>
              <div
                className={
                  displayCount ? style.displayCount : style.noDisplayCount
                }
              >
                {index + 1} / {items.length}
              </div>
              <figure className={style.figure}>
                <img src={item.src} alt={item.alt ?? item.caption} />
                {item.caption && <figcaption>{item.caption}</figcaption>}
              </figure>
            </div>
          ))}
        </AntCarousel>
        {zoom ? (
          <Button
            className={style.zoom}
            icon={<ZoomOutOutlined />}
            onClick={zoomOut}
            type="link"
          />
        ) : (
          <Button
            className={style.zoom}
            icon={<ZoomInOutlined />}
            onClick={zoomIn}
            type="link"
          />
        )}
        {items.length > 1 ? (
          <>
            <Button
              className={style.previous}
              icon={<LeftOutlined />}
              onClick={previous}
              type="link"
            />
            <Button
              className={style.next}
              icon={<RightOutlined />}
              onClick={next}
              type="link"
            />
          </>
        ) : null}
      </div>
    </div>
  )
}

export default Carousel
