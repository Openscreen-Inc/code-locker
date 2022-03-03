const process = require('process')
const {PrescriptionStates} = require('./constants')

const {DEBUG} = process.env

const {
  PRESCRIPTION_READY,
  PRESCRIPTION_CREATED,
  PRESCRIPTION_PICKED_UP,
  PRESCRIPTION_ACCEPTED_BY_PATIENT,
  PRESCRIPTION_ACCEPTED_BY_PHARMACIST,
} = PrescriptionStates

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
}

function debug(...args) {
  if (DEBUG) console.debug(...args)
}

function response(body = {}, statusCode = 200) {
  if (typeof body !== 'string') {
    body = JSON.stringify(body)
  }

  const resp = {
    body,
    statusCode,
    headers: CORS_HEADERS,
  }

  debug(`RESPONSE ${JSON.stringify(resp)}`)

  return resp
}

function pdfResponse(body, name = 'prescription', statusCode = 200) {
  const resp = {
    body,
    statusCode,
    headers: {
      ...CORS_HEADERS,
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${name.split(' ').join('')}.pdf;`,
    },
    isBase64Encoded: true,
  }

  debug(`RESPONSE ${JSON.stringify(resp)}`)

  return resp
}

function pngResponse(body, statusCode = 200) {
  const resp = {
    body,
    statusCode,
    headers: {...CORS_HEADERS, 'Content-Type': 'image/png'},
    isBase64Encoded: true,
  }

  debug(`RESPONSE ${JSON.stringify(resp)}`)

  return resp
}

function messageHtml(message) {
  return `
    <body style="font-size: 40; font-family: sans-serif;">
      <h1>OS Healthcare</h1>
      <p>${message}</p>
    </body>`
}

function htmlResponse(body, statusCode = 200) {
  const resp = {
    body,
    headers: {'Content-Type': 'text/html'},
  }

  debug(`RESPONSE ${JSON.stringify(resp)}`)

  return resp
}

function htmlResponseMessage(message, statusCode) {
  return htmlResponse(messageHtml(message), statusCode)
}

async function currentStateMessage(state, pharmacy, statusCode = 400) {
  switch (state) {
    case PRESCRIPTION_CREATED:
      return htmlResponseMessage(`Prescription has been created but not has yet accepted by patient`, statusCode)

    case PRESCRIPTION_ACCEPTED_BY_PATIENT:
      return htmlResponseMessage(
        `Prescription was sent to '${pharmacy}' and is awaiting processing by the pharmacist`,
        statusCode,
      )

    case PRESCRIPTION_ACCEPTED_BY_PHARMACIST:
      return htmlResponseMessage(`Prescription is currently being prepared by '${pharmacy}'`, statusCode)

    case PRESCRIPTION_READY:
      return htmlResponseMessage(`Prescription is now ready at '${pharmacy}'`, statusCode)

    case PRESCRIPTION_PICKED_UP:
      return htmlResponseMessage(`Prescription has been picked up`, statusCode)

    default:
      return response({}, 501)
  }
}

module.exports = {
  debug,
  response,
  pdfResponse,
  pngResponse,
  htmlResponse,
  currentStateMessage,
}
