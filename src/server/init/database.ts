import { checkdB, startdB } from '@/database'

/**
 * Init database
 */
export const initDatabase = async (): Promise<void> => {
  !tanatloc && (tanatloc = {})

  if (!tanatloc?.pool) {
    const check = await checkdB()
    if (!check) throw new Error('Database not found')
    tanatloc.pool = startdB()
  }
}
