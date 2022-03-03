const {API_ENDPOINT, DEBUG} = process.env
const APP_ENDPOINT = `${API_ENDPOINT}/app`
const {htmlResponse} = require('./lib/util')
const {getPrescription, updatePrescription, getPickup} = require("./prescription");

/***
 * GET /app/prescription?scanId=pppppppp-pppp-pppp-pppp-pppppppppppp
 * GET /app/prescription?scanId=pppppppp-pppp-pppp-pppp-pppppppppppp&patientPhone=+12223334444&pharmacyPhone=+12223334444
 */
const getPrescriptionPage = async (event) => {

  if (event.queryStringParameters.patientPhone) {
    return updatePrescription(event)
  }
  const response = await getPrescription(event)
  if (response.statusCode !== 200) return response
  const data = JSON.parse(response.body)
  return htmlResponse(appHtml(event.queryStringParameters.scanId, data), 200)
}

/***
 * GET /app/pickup?scanId=pppppppp-pppp-pppp-pppp-pppppppppppp
 */
const getPickupPage = async (event) => {
  return getPickup(event)
}

//--------------------------------------------------- inactiveOrDeletedQrHtml --
function appHtml(scanId, data) {
  return `
    <body style="font-size: 40; font-family: sans-serif;">
      <h1>OS Healthcare</h1>
      <p>Enter your 10 digit phone number and select a pharmacy to which the prescription will be transmitted.</p>
      <form action="${APP_ENDPOINT}/prescription">
        <input name="scanId" type="hidden" value="${scanId}"/> 
        <h2>Phone Number</h2>
        <input name="patientPhone" placeholder="999-999-9999" type="input" style="font-size: 32"/>
        <h2>Pharmacies</h2>
        ${data.pharmacies.map(pharmacy => {
          return `<input name="pharmacyPhone" type="radio" value="${pharmacy.cellPhone}" /><span style="font-size: 32">${pharmacy.firstName}</span>`
        }).join('<br>')}
        <h3></h3>
        <input type="submit" style="font-size: 50; height: 100; width: 300;">
      </form>
    </body>`
}

module.exports = {
  getPrescriptionPage,
  getPickupPage,
}
