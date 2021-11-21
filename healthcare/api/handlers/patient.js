const PrescriptionStates = require('../../common/PrescriptionStates')
const response = require('../../common/response')
const {Openscreen} = require('@openscreen/sdk')
const {OS_KEY, OS_SECRET} = process.env

modules.exports = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
})

/**
 *
 * @param event
 * @returns {Promise<{headers: {"Access-Control-Allow-Origin": string, "Access-Control-Allow-Credentials": boolean}, body: string, statusCode: number}>}
 *
 * GET /patient/pppppppp-pppp-pppp-pppp-pppppppppppp
 *    RESPONSE
 *    {
 *      state: 'WAITING-FOR-PATIENT-CODE'
 *    }
 */
const getPatientByScanId = async (event) => {
  const {scanId} = event.pathParameters
  const scan = await os.scan(scanId).get()
  const assetId = scan.assetId
  const prescription = await os.asset(assetId).get()
  const contacts = await os.asset(assetId).contacts().get()
  let {customAttributes} = asset
  const {patient} = customAttributes

  customAttributes.state = PrescriptionStates.WAITING_FOR_PATIENT_CONFIRMATION_CODE
  // GENERATE A 4 DIGIT CODE. FOR DEMO PURPOSES ONLY. NOT SECURE.
  customAttributes.code = `000${Math.floor(Math.random() * 10000)}`.substr(-4),
  await os.asset(assetId).update({customAttributes})

  return response(customAttributes)
}

const updatePatientByScanId = async (event) => {
  const {scanId} = event.pathParameters

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  }
}

module.exports = {getPatientByScanId, updatePatientByScanId}
