/** @module Context.Editor */

import { createContext, Dispatch, ReactNode, useReducer } from 'react'

export interface IEditorCursor {
  row: number
  column: number
}

export interface IEditorState {
  template: string
  model: string
  cursor?: IEditorCursor
  dispatch: Dispatch<IEditorAction>
}

export interface IEditorAction {
  type: string
  value: string | IEditorCursor
}

/**
 * Initial state
 */
export const initialState: IEditorState = {
  template: '',
  model: '',
  dispatch: () => undefined
}

/**
 * Actions types
 */
export const actionTypes = {
  SETTEMPLATE: 'SETTEMPLATE',
  SETMODEL: 'SETMODEL',
  SETCURSOR: 'SETCURSOR'
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

  /**
   * Render
   */
  return (
    <EditorContext.Provider
      value={{ ...editorState, dispatch: editorDispatch }}
    >
      {children}
    </EditorContext.Provider>
  )
}

export default EditorProvider
