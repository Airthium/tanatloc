/** @module Components.Assets.Mathjax */

import { useEffect } from 'react'
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
  text: string
}

/**
 * Inline
 * @param props Props
 */
const Inline = ({ text }: IPropsInline): JSX.Element => {
  useEffect(() => {
    mathjaxRefresh()
  }, [text])

  if (!text) return <></>
  else if (text.includes('\\(') && text.includes('\\)')) return <>{text}</>
  else return <>\({text}\)</>
}

export interface IPropsFormula {
  text: string
}

/**
 * Formula
 * @param props Props
 */
const Formula = ({ text }: IPropsFormula) => {
  useEffect(() => {
    mathjaxRefresh()
  }, [text])

  if (!text) return <></>
  else if (text.includes('$$')) return <>{text}</>
  else return <>$${text}$$</>
}

export interface IPropsHtml {
  html: string
}

/**
 * Html
 * @param props Props
 */
const Html = ({ html }: IPropsHtml): JSX.Element => {
  useEffect(() => {
    mathjaxRefresh()
  }, [html])

  if (!html) return <></>
  else return <>{parse(html)}</>
}

const MathJax = { Head, Inline, Formula, Html }
export default MathJax
