/** @module Components.Assets.Mathjax */

import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'
import parse from 'html-react-parser'

import { mathjaxRefresh } from '@/lib/mathjax'

/**
 * Head
 */
const Head = (): JSX.Element => {
  /**
   * Render
   */
  return <Script src="/mathjax/tex-mml-chtml.js" />
}

export interface IPropsInline {
  text?: string
}

/**
 * Inline
 * @param props Props
 */
const Inline = ({ text }: IPropsInline): JSX.Element => {
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
  return <div ref={element}>{content}</div>
}

export interface IPropsFormula {
  text?: string
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
const Html = ({ html }: IPropsHtml): JSX.Element => {
  // State
  const [content, setContent] = useState<string | JSX.Element | JSX.Element[]>()

  // Ref
  const element = useRef<HTMLDivElement>(null)

  // Update text
  useEffect(() => {
    if (!html) setContent('')
    else setContent(parse(html))

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
  return <div ref={element}>{content}</div>
}

const MathJax = { Head, Inline, Formula, Html }
export default MathJax
