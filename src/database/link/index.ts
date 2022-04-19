/** @module Database.Link */

import { INewLink, add } from './add'
import { TLinkGet, ILink, get } from './get'
import { del } from './del'

const Link = { add, get, del }
export type { INewLink, ILink, TLinkGet }
export default Link
