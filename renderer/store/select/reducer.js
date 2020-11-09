import { selectActionTypes } from './action'

export const selectInitialState = {
  highlighted: {},
  previouslyHighlighted: {},
  selected: []
}

const reducer = (state, action) => {
  if (!state) state = selectInitialState
  switch (action.type) {
    case selectActionTypes.HIGHLIGHT:
      return {
        ...state,
        highlighted: action.part
      }
    case selectActionTypes.UNHIGHLIGHT:
      return {
        ...state,
        highlighted: {},
        previouslyHighlighted: state.highlighted
      }
    case selectActionTypes.SELECT:
      return {
        ...state,
        selected: [...state.selected, action.part]
      }
    case selectActionTypes.UNSELECT:
      //TODO
      return state
    default:
      return state
  }
}

export default reducer
