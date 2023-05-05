import { IEditorHighlight } from '@/context/editor'

/**
 * Get highlight positions
 * @param oldModel Old model
 * @param newModel New model
 * @returns Highlights
 */
export const getHighlightPositions = (
  oldModel: string,
  newModel: string
): IEditorHighlight | undefined => {
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
