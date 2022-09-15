import { checkdB, startdB } from '@/database'

/**
 * Init database
 */
export const initDatabase = async (params?: {
  addStatus: (status: string) => Promise<void>
}): Promise<void> => {
  if (!tanatloc?.pool) {
    const check = await checkdB(params)
    if (!check) throw new Error('Database not found')
    tanatloc.pool = startdB()
  }
}
