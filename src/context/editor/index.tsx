/** @module Context.Editor */

import { createContext, Dispatch, ReactNode, useMemo, useReducer } from 'react'

export interface IEditorCursor {
  row: number
  column: number
}

export interface IEditorState {
  template: string
  model: string
  cursor?: IEditorCursor
  dispatch: Dispatch<IEditorAction>
  templateValid: boolean
  modelValid: boolean
}

export interface IEditorAction {
  type: string
  value: boolean | string | IEditorCursor
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
  SETTEMPLATE: 'SETTEMPLATE',
  SETMODEL: 'SETMODEL',
  SETCURSOR: 'SETCURSOR',
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
    case actionTypes.SETTEMPLATE:
      return { ...state, template: action.value as string }
    case actionTypes.SETMODEL:
      return {
        ...state,
        model: action.value as string
      }
    case actionTypes.SETCURSOR:
      return {
        ...state,
        cursor: action.value as IEditorCursor
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

const EditorProvider = ({ children }: IProps) => {
  // Reducer
  const [editorState, editorDispatch] = useReducer(editorReducer, initialState)

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
