import * as debug from 'debug'
import * as PouchDB from 'pouchdb'

export {PouchDB}

const trace = debug('yellow-common-server:db')

export const merger = (mergeFunction: (doc, existing) => any) => (db, doc): Promise<any> => {
  return db.put(doc).catch((error) => {
    if (error.error === 'conflict') {
      return db.get(error.docId).then((existing) => db.put(mergeFunction(doc, existing)))
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

export const propertyIndex = (db, designDoc: string, viewName: string , property?: string) => {
  if (!property) {
    property = viewName
    viewName = designDoc
  }
  index(db, designDoc, viewName, `function(doc) {
    if (doc.${property}) {
      emit(doc.${property})
    }
  }`)
}

export const relationIndex = (db, designDoc: string, viewName: string , relation?: string) => {
  if (!relation) {
    relation = viewName
    viewName = designDoc
  }
  index(db, designDoc, viewName, `function(doc) {
    if (doc.${relation}) {
      emit(doc._id, {_id: doc.${relation}})
    }
  }`)
}

export const relationsIndex = (db, designDoc: string, viewName: string , relation?: string) => {
  if (!relation) {
    relation = viewName
    viewName = designDoc
  }
  index(db, designDoc, viewName, `function(doc) {
    if (doc.${relation}) {
      doc.${relation}.forEach(function(item) {
        emit(doc._id, {_id: item})
      })
    }
  }`)
}
