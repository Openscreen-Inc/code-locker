//------------------------------------------------------------ Global Imports --
import nanoid from 'nanoid/generate'

export const log = (name, data) => console.log(name, JSON.stringify(data, null, 2))

export const pass = (data) => ({ok: true, data})
export const fail = (error) => ({ok: false, error})
export const uuid = () => nanoid('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 5)

//---------------------------------------------------------------------- http --
export const response = (statusCode, body) => ({
  statusCode,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  },
  body: JSON.stringify(body),
})

export const success = (body) => response(200, body)
export const failure = (error) => response(error.statusCode || 400, error)
