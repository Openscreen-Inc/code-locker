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

const storage = new Configstore('openscreen')
const os = new Openscreen().config({key: OS_KEY, secret: OS_SECRET, environment: OS_ENV, storage})

const doctor = {
  firstName: 'Doctor',
  phone: '+14167036737', // EDIT THIS
  type: ContactRoles.DOCTOR,
}

const patient = {
  firstName: 'Bertrand',
  lastName: 'L',
  phone: '+16478984040', // uniquePhone('+14163'), // EDIT THIS
  type: ContactRoles.PATIENT,
}

const pharmacist1 = {
  firstName: 'Pharmacist 1',
  phone: '+12894898494', // EDIT THIS
  type: ContactRoles.PHARMACIST,
}

const pharmacist2 = {
  firstName: 'Pharmacist 2',
  phone: '+12894898595', // EDIT THIS
  type: ContactRoles.PHARMACIST,
}

const pharmacist3 = {
  firstName: 'Pharmacist 3',
  phone: '+12894898696', // EDIT THIS
  type: ContactRoles.PHARMACIST,
}

const createOrLinkContact = async (assetId, fields) => {
  // DOES THIS CONTACT ALREADY EXIST?
  const {contacts} = await os.project(PROJECT_ID).contacts().get({phone: fields.phone})
  const contact = contacts[0]
  if (contact) {
    // CONTACT ALREADY EXISTS, RE-LINK TO ASSET AND UPDATE
    const {contactId, firstName} = contact
    await os.asset(assetId).contact(contactId).link(fields.type)
    await os.contact(contact.contactId).update({firstName})
  } else {
    // CREATE CONTACT ASSOCIATED WITH ASSET
    await os.asset(assetId).contacts().create(fields)
  }
}

const createResources = async () => {
  let response
  const projectSmsTemplates = os.project(PROJECT_ID).smsTemplates()

  // SMS TEMPLATE FOR MESSAGE SENT TO PATIENT
  await projectSmsTemplates.create({
    body: `Please enter the following code to access your prescription, issued by {asset.customAttributes.doctorName}: {asset.customAttributes.patientCode}`,
    smsTemplateName: "patientCode",
  })

  // SMS TEMPLATE FOR MESSAGE SENT TO PHARMACIST
  await projectSmsTemplates.create({
    body: `Please enter the following code to access the prescription for {asset.customAttributes.patientName}: {asset.customAttributes.pharmacistCode}`,
    smsTemplateName: "pharmacistCode",
  })

  const prescriptionPdf = await fs.readFile('rx-sample.jpeg');
  const pdf = new Buffer(prescriptionPdf).toString('base64');

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
  const {assetId} = prescription
  await createOrLinkContact(assetId, doctor)
  await createOrLinkContact(assetId, patient)
  await createOrLinkContact(assetId, pharmacist1)
  await createOrLinkContact(assetId, pharmacist2)
  await createOrLinkContact(assetId, pharmacist3)

  response = await os.asset(assetId).qrCodes().get({
    format: 'png',
    width: 300,
    dataUrl: false,
    background: '#ffffff',
    foreground: '#0066AA'
  })
  const {qrCodes} = response
  Promise.all(qrCodes.map(qrCode => os.saveQrImageDataToFile(qrCode)))
}

module.exports = createResources

