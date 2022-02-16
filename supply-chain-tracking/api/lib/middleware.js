import middy from '@middy/core'
import jsonBodyParser from '@middy/http-json-body-parser'
import httpErrorHandler from '@middy/http-error-handler'

export const middleware = (handler) => middy(handler).use([jsonBodyParser(), httpErrorHandler()])
