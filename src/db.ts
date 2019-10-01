import * as debug from 'debug'
import * as PouchDB from 'pouchdb'

export {PouchDB}

const trace = debug('home-requirements:db')

export const merger = (mergeFunction: (doc, existing) => any) => (db, doc) => {
  return db.put(doc).catch((error) => {
    if (error.error === 'conflict') {
      return db.get(error.docId).then(({existing}) => db.put(mergeFunction(doc, existing)))
    } else {
      throw error
    }
  }).catch(trace)
}

export const override = merger((doc, {_rev}) => ({...doc, _rev}))

export const merge = merger((doc, existing) => ({...existing, ...doc}))

export const index = (db, designDoc: string, viewName: string , viewFunction?: string) => {
  if (!viewFunction) {
    viewFunction = viewName
    viewName = designDoc
  }
  merge(db, {
    _id: `_design/${designDoc}`,
    language: 'javascript',
    views: {
      [viewName]: {
        map: viewFunction
      }
    }
  })
}

