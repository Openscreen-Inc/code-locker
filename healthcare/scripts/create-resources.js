require('dotenv').config()
const fs = require('fs').promises

const {OS_KEY, OS_SECRET, OS_ENV, APPLICATION_URL, PROJECT_ID} = process.env
const {Openscreen} = require('@openscreen/sdk')
const {Configstore} = require('./configstore')
const {QrCodeIntentType} = require('@openscreen/sdk')
const PrescriptionStates = require('../common/PrescriptionStates')
const ContactRoles = require('../common/ContactRoles')

const uniquePhone = (root) => {
  return root + `00000${Math.floor(Math.random() * 1000000)}`.substr(-6)
}

const uniqueEmail = (root, domain) => {
  return root + `0000000${Math.floor(Math.random() * 100000000)}`.substr(-8) + '@' + domain
}

const storage = new Configstore('openscreen')
const os = new Openscreen().config({key: OS_KEY, secret: OS_SECRET, environment: OS_ENV, storage})

const doctor = {
  firstName: 'Doctor',
  emailAddress: uniqueEmail('Dr', 'mailinator.com'),
  cellPhone: uniquePhone('+16472'), // EDIT THIS
  type: ContactRoles.DOCTOR,
}

const patient = {
  firstName: 'Bertrand',
  lastName: 'L',
  emailAddress: uniqueEmail('Patient', 'mailinator.com'),
  cellPhone: uniquePhone('+14163'), // EDIT THIS
  type: ContactRoles.PATIENT,
}

const pharmacist1 = {
  firstName: 'Pharmacist 1',
  emailAddress: uniqueEmail('Pharmacist1', 'mailinator.com'),
  cellPhone: uniquePhone('+14164'), // EDIT THIS
  type: ContactRoles.PHARMACIST,
}

const pharmacist2 = {
  firstName: 'Pharmacist 2',
  emailAddress: uniqueEmail('Pharmacist2', 'mailinator.com'),
  cellPhone: uniquePhone('+16475'), // EDIT THIS
  type: ContactRoles.PHARMACIST,
}

const pharmacist3 = {
  firstName: 'Pharmacist 3',
  emailAddress: uniqueEmail('Pharmacist3', 'mailinator.com'),
  cellPhone: uniquePhone('+16476'), // EDIT THIS
  type: ContactRoles.PHARMACIST,
}

const createResources = async () => {

  let response
  const projectSmsTemplates = os.project(PROJECT_ID).smsTemplates()

  await projectSmsTemplates.create({
    body: `Please enter the following code to access your prescription, issued by {asset.customAttributes.doctorName}: {asset.customAttributes.patientCode}`,
    smsTemplateName: "patientCode",
  })

  await projectSmsTemplates.create({
    body: `Please enter the following code to access the prescription for {asset.customAttributes.patientName}: {asset.customAttributes.pharmacistCode}`,
    smsTemplateName: "pharmacistCode",
  })

  const prescriptionPdf = await fs.readFile('prescription.pdf');
  // const pdf = new Buffer(prescriptionPdf).toString('base64');
  const pdf = 'this is a pdf'

  response = await os.project(PROJECT_ID).assets().create({
    name: 'Prescription',
    description: `Prescription for ${patient.firstName} ${patient.lastName}`,
    customAttributes: {
      state: PrescriptionStates.PRESCRIPTION_CREATED,
      pdf,
    },
    qrCodes: [{
      intentType: QrCodeIntentType.DYNAMIC_REDIRECT_TO_APP,
      intent: `${APPLICATION_URL}/patient`,
      intentState: {type: ContactRoles.PATIENT}
    },{
      intentType: QrCodeIntentType.DYNAMIC_REDIRECT_TO_APP,
      intent: `${APPLICATION_URL}/pharmacist`,
      intentState: {type: ContactRoles.PHARMACIST}
    }]
  })

  const prescription = response.asset
  const assetContacts = os.asset(prescription.assetId).contacts()

  await assetContacts.create(doctor)
  await assetContacts.create(patient)
  await assetContacts.create(pharmacist1)
  await assetContacts.create(pharmacist2)
  await assetContacts.create(pharmacist3)

  response = await os.asset(prescription.assetId).qrCodes().get({
    format: 'png',
    width: 300,
    dataUrl: false,
    background: '#ffffff',
    foreground: '#0066AA'
  })
  const {qrCodes} = response
  Promise.all(qrCodes.map(qrCode => os.saveQrImageDataToFile(qrCode)))
}

module.exports = {
  createResources
}
