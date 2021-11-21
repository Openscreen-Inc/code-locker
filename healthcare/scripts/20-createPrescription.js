const fs = require('fs').promises
const PrescriptionStates = require('../common/PrescriptionStates')
const QrCodeRole = require('../common/ContactRoles')
const context = require('./context')

module.exports = async () => {

  const prescriptionPdf = await fs.readFile('prescription.pdf');
  const pdf = new Buffer(prescriptionPdf).toString('base64');


  const {osProject, patientCodeTemplateId, pharmacistCodeTemplateId} = context
  const osAssets = osProject.assets()


  const prescription = await osAssets.create({
    name: 'Prescription',
    description: `Prescription for ${patient.firstName} ${patient.lastName}`,
    customAttributes: {
      state: PrescriptionStates.PRESCRIPTION_CREATED,
      pdf,
      patientCodeTemplateId,
      pharmacistCodeTemplateId,
    },
    qrCodes: [{
      intentType: QrCodeIntentType.DYNAMIC_REDIRECT_TO_APP,
      intent: `${APPLICATION_URL}/patient`,
      customAttributes: {role: QrCodeRole.PATIENT,}
    },{
      intentType: QrCodeIntentType.DYNAMIC_REDIRECT_TO_APP,
      intent: `${APPLICATION_URL}/pharmacist`,
      customAttributes: {role: QrCodeRole.PHARMACIST,}
    }]
  }).asset
  console.info(`Prescription: `, JSON.stringify(prescription, ' ', 2))


  context.assign({
    osAssets,
    osPrescription: os.asset(prescription.assetid),
  })
}

