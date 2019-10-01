import * as _ from 'lodash'
import { merge } from './db'

export interface IndexQueryParameters {
  key?: any
  startkey?: any
  endkey?: any
  inclusive_end?: boolean
  keys?: any[]
}
export const listByIndex = <T>(db, query, key: IndexQueryParameters): () => Promise<T[]> =>
  () => db.query(query, {include_docs: true, ...key})
    .then((response) => _(response).get('rows').map(_.property('doc')))

export const simpleGet = <T>(db) => (id: string): Promise<T> => db.get(id)

export const simplePut = <T>(db) => (id: string, value: T) => merge(db, {...value, _id: id})
