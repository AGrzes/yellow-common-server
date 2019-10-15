import { Router, static as expressStatic} from 'express'
import * as express from 'express'
import { cwd } from 'process'

interface WebRouterOptions {
  webBundlePath?: string
  staticPath?: string
  indexPath?: string
}

export function webRouter(options: WebRouterOptions = {}): Router {
  const webBundlePath = options.webBundlePath || 'web/dist'
  const staticPath = options.webBundlePath || 'static'
  const indexPath = options.webBundlePath || `${cwd()}/static/index.html`
  const router = Router()
  router.use(expressStatic(webBundlePath))
  router.use(expressStatic(staticPath))
  router.get('*', (req, res) => {
      res.sendFile(indexPath)
  })
  return router
}

export {express}
