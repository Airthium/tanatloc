import { checkdB, startdB } from '@/database'

/**
 * Init database
 */
export const initDatabase = async (
  status?: string[],
  setStatus?: (status: string[]) => Promise<void>
): Promise<void> => {
  if (!tanatloc?.pool) {
    const check = await checkdB(status, setStatus)
    if (!check) throw new Error('Database not found')
    tanatloc.pool = startdB()
  }
}
