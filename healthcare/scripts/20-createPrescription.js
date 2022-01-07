const fs = require('fs').promises
const {QrCodeIntentType} = require('@openscreen/sdk')
const PrescriptionStates = require('../common/PrescriptionStates')
const ContactRoles = require('../common/ContactRoles')
const context = require('./00-context')

const {APPLICATION_URL, PROJECT_ID} = process.env

module.exports = async () => {

  const prescriptionPdf = await fs.readFile('prescription.pdf');
  // const pdf = new Buffer(prescriptionPdf).toString('base64');
  const pdf = 'this is a pdf'

  const {os, osProject, patient} = context

  const response = await os.project(PROJECT_ID).assets().create({
    name: 'Prescription',
    description: `Prescription for ${patient.firstName} ${patient.lastName}`,
    customAttributes: {
      state: PrescriptionStates.PRESCRIPTION_CREATED,
      pdf,
    },
    qrCodes: [{
      intentType: QrCodeIntentType.STATIC_REDIRECT,
      intent: `${APPLICATION_URL}/patient`,
      intentState: {type: ContactRoles.PATIENT}
    },{
      intentType: QrCodeIntentType.STATIC_REDIRECT,
      intent: `${APPLICATION_URL}/pharmacist`,
      intentState: {type: ContactRoles.PHARMACIST}
    }]
  })
  const prescription = response.asset


  Object.assign(context, {
    osPrescription: os.asset(prescription.assetId),
  })
}

