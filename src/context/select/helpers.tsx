/** @module Context.Select.Helpers */

import { ISelect } from '.'

/**
 * Add or remove selection to selected
 * @param selected Selected
 * @param selection Selection
 * @returns Selected
 */
export const addOrRemoveSelection = (
  selected: ISelect[],
  selection: ISelect
): ISelect[] => {
  let localSelected = [...selected]

  // Index
  const index = localSelected.findIndex((s) => s.uuid === selection.uuid)

  // Add or remove
  if (index === -1) localSelected.push(selection)
  else
    localSelected = [
      ...localSelected.slice(0, index),
      ...localSelected.slice(index + 1)
    ]

  // Return
  return localSelected
}

/**
 * Add selections to selected
 * @param selected Selected
 * @param selections Selections
 * @returns Selected
 */
export const addSelections = (
  selected: ISelect[],
  selections: ISelect[]
): ISelect[] => {
  // Merge
  const localSelected = [...selected, ...selections]

  // Remove duplicate
  return localSelected.reduce((accumulator: ISelect[], current: ISelect) => {
    if (!accumulator.find((item) => item.uuid === current.uuid))
      accumulator.push(current)

    return accumulator
  }, [])
}

/**
 * Remove selections from selected
 * @param selected Selected
 * @param selections Selections
 * @returns Selected
 */
export const removeSelections = (
  selected: ISelect[],
  selections: ISelect[]
): ISelect[] => {
  let localSelected = [...selected]

  selections.forEach((selection) => {
    // Index
    const index = localSelected.findIndex((s) => s.uuid === selection.uuid)

    // Remove
    if (index !== -1)
      localSelected = [
        ...localSelected.slice(0, index),
        ...localSelected.slice(index + 1)
      ]
  })

  // Return
  return localSelected
}

/**
 * Swap selections to selected
 * @param selected Selected
 * @param selections Selections
 * @returns Selected
 */
export const swapSelections = (
  selected: ISelect[],
  selections: ISelect[]
): ISelect[] => {
  let localSelected = [...selected]

  selections.forEach((selection) => {
    // Index
    const index = localSelected.findIndex((s) => s.uuid === selection.uuid)

    // Remove
    if (index === -1) localSelected.push(selection)
    else
      localSelected = [
        ...localSelected.slice(0, index),
        ...localSelected.slice(index + 1)
      ]
  })

  // Return
  return localSelected
}
