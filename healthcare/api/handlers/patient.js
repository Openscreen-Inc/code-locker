const PrescriptionStates = require('../../common/PrescriptionStates')
const ContactRoles = require('../../common/ContactRoles')
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
  const scan = await os.scan(event.pathParameters.scanId).get()
  const osAsset = os.asset(scan.assetId)
  const prescription = await osAsset.get()
  const {customAttributes} = asset
  if (customAttributes.state !== PrescriptionStates.PRESCRIPTION_CREATED &&
    customAttributes.state !== PrescriptionStates.WAITING_FOR_PATIENT_CONFIRMATION_CODE)
  {
    throw Error(`Prescription is in process`)
  }

  const patient = await os.asset(scan.assetId).contacts().get().filter(p => p.type === ContactRoles.PATIENT)

  if (!patient) {
    throw Error(`No PATIENT type contact associated with prescription`)
  }

  customAttributes.assign({
    state: PrescriptionStates.WAITING_FOR_PATIENT_CONFIRMATION_CODE,
    // GENERATE A 4 DIGIT CODE. FOR DEMO PURPOSES ONLY. NOT SECURE.
    code: `000${Math.floor(Math.random() * 10000)}`.substr(-4),
  })
  await osAsset.update({customAttributes})

  return response({

  })
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
