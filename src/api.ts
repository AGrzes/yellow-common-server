import { Router } from 'express'

interface WrappedService<T> {
  list?(): Promise<T[]>
  get?(id: string): Promise<T>
  put?(id: string, data: T): Promise<any>
  post?(data: T): Promise<any>
  delete?(id: string): Promise<any>
}

export function wrap<T>(router: Router, config: WrappedService<T>): Router
export function wrap<T>(config: WrappedService<T>): Router
export function wrap<T>(arg0: WrappedService<T> | Router, arg1?: WrappedService<T>) {
  let router: Router
  let config: WrappedService<T>
  if (!arg1) {
    config = arg0 as WrappedService<T>
    router = Router()
  } else {
    router = arg0 as Router
    config = arg1
  }

  if (config.list) {
    router.get('/', (request, response) => config.list()
    .then((l) => response.send(l))
    .catch(() => response.status(500).send())
    )
  }

  if (config.get) {
    router.get('/:id', (request, response) => config.get(request.params.id)
      .then((l) => response.send(l))
      .catch(() => response.status(500).send())
    )
  }

  if (config.put) {
    router.put('/:id', (request, response) => config.put(request.params.id, request.body)
      .then((l) => response.send(l))
      .catch(() => response.status(500).send())
    )
  }

  if (config.post) {
    router.post('/', (request, response) => config.post(request.body)
      .then((l) => response.send(l))
      .catch(() => response.status(500).send())
    )
  }

  if (config.delete) {
    router.delete('/:id', (request, response) => config.delete(request.params.id)
      .then((l) => response.send(l))
      .catch(() => response.status(500).send())
    )
  }

  return router
}
