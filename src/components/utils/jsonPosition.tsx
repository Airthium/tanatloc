/** @module Components.Utils.JSONPosition */

import { IEditorHighlight } from '@/context/editor'

/**
 * Get highlight position
 * @param oldModel Old model
 * @param newModel New model
 * @returns Highlights
 */
export const getHighlightPosition = (
  oldModel: string,
  newModel: string
): IEditorHighlight => {
  const oldLines = oldModel.split('\n')
  const newLines = newModel.split('\n')

  const addeds = newLines
    .map((line, index) => {
      if (!oldLines.includes(line)) return index
    })
    .filter((l) => l) as number[]

  return {
    begin: addeds[0],
    end: addeds[addeds.length - 1]
  }
}
