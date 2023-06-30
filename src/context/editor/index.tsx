/** @module Context.Editor */

import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react'

export interface IEditorCursor {
  row: number
  column: number
}

export interface IEditorHighlight {
  begin: number
  end: number
}

export interface IEditorError {
  title: string
  description: string
  type: 'error' | 'warning' | 'info'
  row?: number
  column?: number
}

export interface IEditorState {
  id?: string
  template: string
  model: string
  jsonHighlight?: IEditorHighlight
  templateHighlight?: IEditorHighlight
  jsonCursor?: IEditorCursor
  templateCursor?: IEditorCursor
  jsonError?: IEditorError
  templateError?: IEditorError
  templateValid: boolean
  modelValid: boolean
  dispatch: Dispatch<IEditorAction>
}

export interface IEditorAction {
  type: string
  value:
    | boolean
    | string
    | IEditorCursor
    | IEditorHighlight
    | IEditorError
    | undefined
}

/**
 * Initial state
 */
export const initialState: IEditorState = {
  template: '',
  model: '',
  dispatch: () => undefined,
  templateValid: false,
  modelValid: false
}

/**
 * Actions types
 */
export const actionTypes = {
  SETID: 'SETID',
  SETTEMPLATE: 'SETTEMPLATE',
  SETMODEL: 'SETMODEL',
  SETJSONHIGHLIGHT: 'SETJSONHIGHLIGHT',
  SETTEMPLATEHIGHLIGHT: 'SETTEMPLATEHIGHLIGHT',
  SETJSONCURSOR: 'SETJSONCURSOR',
  SETTEMPLATECURSOR: 'SETTEMPLATECURSOR',
  SETJSONERROR: 'SETJSONERROR',
  SETTEMPLATEERROR: 'SETTEMPLATEERROR',
  SETTEMPLATEVALID: 'SETTEMPLATEVALID',
  SETMODELVALID: 'SETMODELVALID'
}

/**
 * Context
 */
export const EditorContext = createContext(initialState)

/**
 * Reducer
 * @param state State
 * @param action Action
 * @returns State
 */
export const editorReducer = (
  state: IEditorState,
  action: IEditorAction
): IEditorState => {
  switch (action.type) {
    case actionTypes.SETID:
      return { ...state, id: action.value as string }
    case actionTypes.SETTEMPLATE:
      return { ...state, template: action.value as string }
    case actionTypes.SETMODEL:
      return {
        ...state,
        model: action.value as string
      }
    case actionTypes.SETJSONHIGHLIGHT:
      return {
        ...state,
        jsonHighlight: action.value as IEditorHighlight
      }
    case actionTypes.SETTEMPLATEHIGHLIGHT:
      return {
        ...state,
        templateHighlight: action.value as IEditorHighlight
      }
    case actionTypes.SETJSONCURSOR:
      return {
        ...state,
        jsonCursor: action.value as IEditorCursor
      }
    case actionTypes.SETTEMPLATECURSOR:
      return {
        ...state,
        templateCursor: action.value as IEditorCursor
      }
    case actionTypes.SETJSONERROR:
      return {
        ...state,
        jsonError: action.value as IEditorError
      }
    case actionTypes.SETTEMPLATEERROR:
      return {
        ...state,
        templateError: action.value as IEditorError
      }
    case actionTypes.SETTEMPLATEVALID:
      return {
        ...state,
        templateValid: action.value as boolean
      }
    case actionTypes.SETMODELVALID:
      return {
        ...state,
        modelValid: action.value as boolean
      }
    default:
      return state
  }
}

/**
 * Props
 */
export interface IProps {
  children: ReactNode
}

/**
 * EditorProvider
 * @param props Props
 * @returns EditorProvider
 */
const EditorProvider = ({ children }: IProps) => {
  // Reducer
  const [editorState, editorDispatch] = useReducer(editorReducer, initialState)

  // Value
  const contextValue = useMemo(
    () => ({ ...editorState, dispatch: editorDispatch }),
    [editorState]
  )

  /**
   * Render
   */
  return (
    <EditorContext.Provider value={contextValue}>
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider
