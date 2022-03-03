const {DEBUG} = process.env
const {PrescriptionStates} = require("./prescription-states");

const response = (body = {}, statusCode = 200) => {
  if (typeof body !== 'string') body = JSON.stringify(body)
  const resp = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body
  }
  if (DEBUG) console.debug(`RESPONSE ${JSON.stringify(resp)}`)
  return resp
}

const pdfResponse = (pdf, name = 'prescription', statusCode = 200) => {
  const resp = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${name.split(' ').join('')}.pdf;`,
    },
    body: pdf,
    isBase64Encoded: true,
  }
  if (DEBUG) console.debug(`RESPONSE ${JSON.stringify(resp)}`)
  return resp
}

const pngResponse = (png, statusCode = 200) => {
  const resp = {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Content-Type': 'image/png',
    },
    body: png,
    isBase64Encoded: true,
  }
  if (DEBUG) console.debug(`RESPONSE ${JSON.stringify(resp)}`)
  return resp
}

const htmlResponse = (body, statusCode = 200) => {
  const resp = {
    headers: {
      'Content-Type': 'text/html',
    },
    body,
  }
  if (DEBUG) console.debug(`RESPONSE ${JSON.stringify(resp)}`)
  return resp
}

const currentStateMessage = async (state, pharmacy, statusCode = 400) => {

  switch (state) {
    case PrescriptionStates.PRESCRIPTION_CREATED:
      return htmlResponse(messageHtml(`Prescription has been created but not has yet accepted by patient`), statusCode)

    case PrescriptionStates.PRESCRIPTION_ACCEPTED_BY_PATIENT:
      return htmlResponse(messageHtml(`Prescription was sent to '${pharmacy}' and is awaiting processing by the pharmacist`), statusCode)

    case PrescriptionStates.PRESCRIPTION_ACCEPTED_BY_PHARMACIST:
      return htmlResponse(messageHtml(`Prescription is currently being prepared by '${pharmacy}'`), statusCode)

    case PrescriptionStates.PRESCRIPTION_READY:
      return htmlResponse(messageHtml(`Prescription is now ready at '${pharmacy}'`), statusCode)

    case PrescriptionStates.PRESCRIPTION_PICKED_UP:
      return htmlResponse(messageHtml(`Prescription has been picked up`), statusCode)

    default:
      return response({}, 501)

  }
}

function messageHtml(message) {
  return `
    <body style="font-size: 40; font-family: sans-serif;">
      <h1>OS Healthcare</h1>
      <p>${message}</p>
    </body>`
}

module.exports = {
  response,
  pdfResponse,
  pngResponse,
  currentStateMessage,
  htmlResponse,
}

