import dynamic from 'next/dynamic'

const FreeFEMCode = dynamic(() => import('./freefem_editor'), { ssr: false })
const JSONCode = dynamic(() => import('./json_editor'), { ssr: false })

/**
 * Code
 */
const Code = (): JSX.Element => {
  /**
   * Render
   */
  return (
    <div className="Editor-code">
      <FreeFEMCode />
      <JSONCode />
    </div>
  )
}

export default Code
