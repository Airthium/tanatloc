export const selectActionTypes = {
  HIGHLIGHT: 'HIGHLIGHT',
  UNHIGHLIGHT: 'UNHIGHLIGHT',
  SELECT: 'SELECT',
  UNSELECT: 'UNSELECT'
}

export const highlight = (part) => ({
  type: selectActionTypes.HIGHLIGHT,
  part: part
})

export const unhighlight = () => ({
  type: selectActionTypes.UNHIGHLIGHT
})

export const select = (part) => ({
  type: selectActionTypes.SELECT,
  part: part
})

export const unselect = (part) => ({
  type: selectActionTypes.UNSELECT,
  part: part
})
