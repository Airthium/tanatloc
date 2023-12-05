/** @module Components.Assets.Mathjax */

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import parse from 'html-react-parser'
import { Spin } from 'antd'

import { mathjaxRefresh } from '@/lib/mathjax'

/**
 * Head
 */
const Head = (): ReactNode => {
  /**
   * Render
   */
  return <Script src="/mathjax/tex-mml-chtml.js" />
}

export interface IPropsInline {
  text?: string
}

/**
 * Back Inline
 * @param props Props
 * @returns Inline
 */
const BackInline = ({ text }: IPropsInline): ReactNode => {
  // Content
  let content = text ?? ''
  if (text && !text.includes('\\(') && !text.includes('\\)'))
    content = '\\(' + text + '\\)'

  /**
   * Render
   */
  return <div style={{ display: 'inline-block' }}>{content}</div>
}

/**
 * Inline
 * @param props Props
 */
const Inline = ({ text }: IPropsInline): ReactNode => {
  // State
  const [content, setContent] = useState<string>()

  // Ref
  const element = useRef<HTMLDivElement>(null)

  // Update text
  useEffect(() => {
    if (!text) setContent('')
    else if (text.includes('\\(') && text.includes('\\)')) setContent(text)
    else setContent('\\(' + text + '\\)')

    mathjaxRefresh()
  }, [text])

  // Update MathJax
  useEffect(() => {
    const div = element.current
    /* istanbul ignore next */
    if (!div) return

    mathjaxRefresh([div])
  }, [content])

  /**
   * Render
   */
  return (
    <div style={{ display: 'inline-block' }} ref={element}>
      {content}
    </div>
  )
}

export interface IPropsFormula {
  text?: string
}

/**
 * Back Formula
 * @param props Props
 * @returns Formula
 */
const BackFormula = ({ text }: IPropsFormula): ReactNode => {
  // Content
  let content = text ?? ''
  if (text && !text.includes('$$')) content = '$$' + text + '$$'

  /**
   * Render
   */
  return <div>{content}</div>
}

/**
 * Formula
 * @param props Props
 */
const Formula = ({ text }: IPropsFormula) => {
  // State
  const [content, setContent] = useState<string>()

  // Ref
  const element = useRef<HTMLDivElement>(null)

  // Update text
  useEffect(() => {
    if (!text) setContent('')
    else if (text.includes('$$')) setContent(text)
    else setContent('$$' + text + '$$')

    mathjaxRefresh()
  }, [text])

  // Update MathJax
  useEffect(() => {
    const div = element.current
    /* istanbul ignore next */
    if (!div) return

    mathjaxRefresh([div])
  }, [content])

  /**
   * Render
   */
  return <div ref={element}>{content}</div>
}

export interface IPropsHtml {
  html?: string
}

/**
 * Html
 * @param props Props
 */
const Html = ({ html }: IPropsHtml): ReactNode => {
  // State
  const [content, setContent] = useState<ReactNode>()
  const [loading, setLoading] = useState<boolean>(false)

  // Ref
  const element = useRef<HTMLDivElement>(null)

  // Update text
  useEffect(() => {
    setContent('')

    if (html) {
      setContent('')
      setLoading(true)
      setTimeout(() => {
        setContent(parse(html))
        setLoading(false)
      }, 100)
    }

    mathjaxRefresh()
  }, [html])

  // Update MathJax
  useEffect(() => {
    const div = element.current
    /* istanbul ignore next */
    if (!div) return

    mathjaxRefresh([div])
  }, [content])

  /**
   * Render
   */
  if (loading) return <Spin />
  return <div ref={element}>{content}</div>
}

const MathJax = { Head, BackInline, Inline, BackFormula, Formula, Html }
export default MathJax
