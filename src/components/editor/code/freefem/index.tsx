import { useCallback, useContext, useRef } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/theme-sqlserver'
import './mode/mode-freefem-ejs'

import { EditorContext } from '@/context/editor'
import { setCursor, setTemplate } from '@/context/editor/actions'

/**
 * Set annotations
 * @param selectedText Selected text
 * @returns Annotations
 */
const setAnnotations = (selectedText: string): any[] => {
  console.log(selectedText)
  // Si le texte sélectionné correspond à une fonction connue, retourne une annotation avec un lien vers sa documentation
  if (selectedText === 'readmesh3') {
    console.log('dedans')
    return [
      {
        row: 12,
        column: 0,
        text: 'Ceci est une fonction. Cliquez ici pour accéder à sa documentation : <a href="https://docs.freefem.org/maFonction">https://docs.freefem.org/maFonction</a>',
        type: 'info'
      }
    ]
  }

  // Si le texte sélectionné ne correspond pas à une fonction connue, retourne un tableau vide
  return []
}

/**
 * FreeFEM code
 */
const FreeFEMCode = (): JSX.Element => {
  // Data
  const { template, dispatch } = useContext(EditorContext)
  const editorRef = useRef(null)

  /**
   * On change
   * @param newCode New code
   */
  const onChange = useCallback(
    (newCode?: string): void => {
      dispatch(setTemplate(newCode || ''))
    },
    [dispatch]
  )

  /**
    
    On cursor change
    */
  const onSelectionChange = useCallback(
    (selection: any): void => {
      if (editorRef.current) {
        const editor = editorRef.current as AceEditor
        console.log(editor.editor.session)
        // Récupère le texte sélectionné
        const selectedText = editor.editor.session.getTextRange(
          selection.getRange()
        )
        // Définit les annotations à afficher
        editor.editor.session.setAnnotations(setAnnotations(selectedText))
      }

      dispatch(
        setCursor({
          row: selection.cursor.row,
          column: selection.cursor.column
        })
      )
    },
    [dispatch]
  )

  /**
    
    Render
    */
  return (
    <AceEditor
      width="100%"
      height="calc(100% - 64px)"
      fontSize={16}
      theme="sqlserver"
      mode="freefem-ejs"
      name="freefem_editor"
      value={template}
      editorProps={{ $blockScrolling: true, $showPrintMargin: false }}
      onSelectionChange={onSelectionChange}
      onChange={onChange}
      // Affiche les annotations définies
      annotations={setAnnotations('')}
      ref={editorRef}
    />
  )
}
export default FreeFEMCode
