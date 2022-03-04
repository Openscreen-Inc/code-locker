require('dotenv').config({path: '../.env'})
const {OS_KEY, OS_SECRET, API_ENDPOINT, PROJECT_ID} = process.env
const APP_ENDPOINT = `${API_ENDPOINT}/app`

const fs = require('fs').promises

const {Configstore} = require('./configstore')
const {PrescriptionStates} = require('../api/handlers/lib/prescription-states')
const {ContactRoles} = require('../api/handlers/lib/contact-roles')
const {TemplateNames} = require("../api/handlers/lib/template-names");
const {QrCodeTypes} = require("../api/handlers/lib/qr-code-types");

const {Openscreen, QrCodeIntentType, QrCodeDynamicRedirectType} = require('@openscreen/sdk')
const storage = new Configstore('openscreen')

const os = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
  environment: process.env.OS_ENV,
  storage,
})

const clinic = {
  firstName: 'City Clinic',
  cellPhone: '+12015551211', // @TODO: EDIT THIS
  type: ContactRoles.CLINIC,
}

const patient = {
  firstName: 'Lucy',
  cellPhone: '+12015551212', // @TODO: EDIT THIS
  type: ContactRoles.PATIENT,
}

const pharmacy1 = {
  firstName: 'PharmaNow',
  cellPhone: '+12015551213', // @TODO: EDIT THIS
  type: ContactRoles.PHARMACIST,
}

const pharmacy2 = {
  firstName: 'Drugs-R-Us',
  cellPhone: '+12015551214', // @TODO: EDIT THIS
  type: ContactRoles.PHARMACIST,
}

const pharmacy3 = {
  firstName: 'Pharmex',
  cellPhone: '+12015551215', // @TODO: EDIT THIS
  type: ContactRoles.PHARMACIST,
}

const createOrLinkContact = async (assetId, fields) => {
  // DOES THIS CONTACT ALREADY EXIST?
  const {contacts} = await os.project(PROJECT_ID).contacts().get({phone: fields.cellPhone})
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

const createTemplates = async () => {
  const projectSmsTemplates = os.project(PROJECT_ID).smsTemplates()

  // SMS TEMPLATE: PRESCRIPTION_DROP_OFF
  await projectSmsTemplates.create({
    body: `From: OS Healthcare\n\nA prescription for {{patient}} has been dropped off. Tap the following link to see prescription: {{link1}} \n\nWhen the prescription is ready for pickup, tap the following link to notify patient: {{link2}}`,
    smsTemplateName: TemplateNames.PRESCRIPTION_DROP_OFF,
  })

  // SMS TEMPLATE: PRESCRIPTION_BEING_PREPARED
  await projectSmsTemplates.create({
    body: `From: OS Healthcare\n\nYour prescription from {{clinic}} is being prepared by {{pharmacy}}. You will receive a notification when it is ready for pickup`,
    smsTemplateName: TemplateNames.PRESCRIPTION_BEING_PREPARED,
  })

  // SMS TEMPLATE: PRESCRIPTION_READY_FOR_PICKUP
  await projectSmsTemplates.create({
    body: `From OS Healthcare\n\nYour prescription from {{clinic}} is ready at {{pharmacy}}. Tap the following link and show the QR code to the pharmacist: {{link}}`,
    smsTemplateName: TemplateNames.PRESCRIPTION_READY_FOR_PICKUP,
  })
}

const createContacts = async (assetId) => {
  await createOrLinkContact(assetId, clinic)
  await createOrLinkContact(assetId, patient)
  await createOrLinkContact(assetId, pharmacy1)
  await createOrLinkContact(assetId, pharmacy2)
  await createOrLinkContact(assetId, pharmacy3)
}

const createPrescriptionAsset = async () => {

  const response = await os.project(PROJECT_ID).assets().create({
    name: 'Prescription',
    description: `Prescription for ${patient.firstName}`,
    qrCodes: [{
      intentType: QrCodeIntentType.DYNAMIC_REDIRECT,
      dynamicRedirectType: QrCodeDynamicRedirectType.SCAN_ID_IN_QUERY_STRING_PARAMETER,
      intent: `${APP_ENDPOINT}/prescription`,
      intentState: { qrType: QrCodeTypes.PRESCRIPTION_QR },
    },{
      intentType: QrCodeIntentType.DYNAMIC_REDIRECT,
      dynamicRedirectType: QrCodeDynamicRedirectType.SCAN_ID_IN_QUERY_STRING_PARAMETER,
      intent: `${APP_ENDPOINT}/pickup`,
      intentState: { qrType: QrCodeTypes.PICKUP_QR },
    }]
  })

  return response.asset.assetId
}

const getPrescriptionPdf = async () => {
  // PDF CONTAINING RX SCRIPT
  const prescriptionPdf = await fs.readFile('rx-sample.pdf');
  return new Buffer(prescriptionPdf).toString('base64');
}

const getQrCodeImagesAndUpdateCustomAttributes = async (assetId) => {

  const pdf = await getPrescriptionPdf()
  const customAttributes = {
    state: PrescriptionStates.PRESCRIPTION_CREATED,
    clinic: clinic.firstName,
    patient: patient.firstName,
    patientPhone: patient.cellPhone,
    pdf,
  }

  const response = await os.asset(assetId).qrCodes().get({
    format: 'png',
    width: 600,
    dataUrl: false,
    background: '#ffffff',
    foreground: '#0066AA'
  })

  await response.qrCodes.map(qrCode => async () => {

    const {qrCodeId, intentState} = qrCode
    switch (intentState.qrType) {

      case QrCodeTypes.PRESCRIPTION_QR:
        console.info(`QrCode-ScanPrescription`)
        return os.saveQrImageDataToFile(qrCode, 'QrCodeOnPrescription.png')

      case QrCodeTypes.PICKUP_QR:
        customAttributes.pickupQrCodeId = qrCodeId
        return true
    }

    return true
  }).reduce((promise, work) => promise.then(work), Promise.resolve())

  await os.asset(assetId).update({customAttributes})
}

const createResources = async () => {
  await createTemplates()
  const assetId = await createPrescriptionAsset()
  await createContacts(assetId)
  return getQrCodeImagesAndUpdateCustomAttributes(assetId)

}

module.exports = createResources
