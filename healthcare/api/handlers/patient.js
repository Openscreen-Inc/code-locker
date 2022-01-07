const PrescriptionStates = require('../../common/PrescriptionStates')
const ContactRoles = require('../../common/ContactRoles')
const response = require('./response')
const {Openscreen} = require('@openscreen/sdk')
const {OS_KEY, OS_SECRET} = process.env

modules.exports = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
})

/***
 * GET /patient/pppppppp-pppp-pppp-pppp-pppppppppppp
 */
const getPatientByScanId = async (event) => {
  // GET THE SCAN INFORMATION
  const {scanId} = event.pathParameters
  const response = await os.scan(scanId).get()
  const {scan, asset: prescription, qrCode, contacts} = response

  // WE STORE OUR PRESCRIPTION DATA IN THE CUSTOM ATTRIBUTES
  // CHECK THE STATE OF THE PRESCRIPTION
  const {customAttributes} = prescription
  if (customAttributes.state !== PrescriptionStates.PRESCRIPTION_CREATED &&
    customAttributes.state !== PrescriptionStates.WAITING_FOR_PATIENT_CONFIRMATION_CODE)
  {
    throw Error(`Can't `)
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

/***
 * PATCH /patient/pppppppp-pppp-pppp-pppp-pppppppppppp
 */
const updatePatientByScanId = async (event) => {
  const {scanId} = event.pathParameters
  const response = await os.scan(scanId).get()
  const {scan, asset: prescription, qrCode, contacts} = response
  const {customAttributes} = prescription
  if (customAttributes.state !== PrescriptionStates.WAITING_FOR_PATIENT_CONFIRMATION_CODE) {
    throw Error(`Not waiting for patient confirmation code`)
  }
    const {code} = event.body

  return response()
}

module.exports = {getPatientByScanId, updatePatientByScanId}
