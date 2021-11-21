#!/usr/bin/env node
require('dotenv').config()
const {OS_KEY, OS_SECRET, PROJECT_ID} = process.env
const fs = require('fs').promises
const PrescriptionStates = require('../common/PrescriptionStates')
const QrCodeRole = require('../common/ContactRoles')

let doctor
let patient
let pharmacist1
let pharmacist2
let pharmacist3
let pharmacists = []
let prescription
let qrCodes
let patientQrCode
let pharmacistQrCode

const {Openscreen, QrCodeIntentType} = require('@openscreen/sdk')
const os = new Openscreen().config({key: OS_KEY, secret: OS_SECRET})

const formatError = (err) => {
  const response = err.response
  if (response) {
    const status = response.status ? ` (${response.status})` : ''
    const statusText = response.statusText || err.message || 'Unknown error'
    const data = response.data
    const stack = data && data.stack
    console.error(`Error: ${statusText}${status}`)
    if (data) console.debug(JSON.stringify(data, ' ', 2))
    if (stack) console.debug(stack)
    return
  }
  console.error(err.message)
  if (err.stack) console.debug(err.stack)
}

const setUp = async () => {
  const prescriptionPdf = await fs.readFile('prescription.pdf');
  const pdf = new Buffer(prescriptionPdf).toString('base64');

  const assets = os.project(PROJECT_ID).assets()
  prescription = await assets.create({
    name: 'Prescription',
    description: `Prescription for ${patient.firstName} ${patient.lastName}`,
    customAttributes: {
      state: PrescriptionStates.PRESCRIPTION_CREATED,
      pdf,
    },
    qrCodes: [{
      intentType: QrCodeIntentType.DYNAMIC_REDIRECT_TO_APP,
      intent: `${APPLICATION_URL}/patient`,
      customAttributes: {
        role: QrCodeRole.PATIENT,
      }
    },{
      intentType: QrCodeIntentType.DYNAMIC_REDIRECT_TO_APP,
      intent: `${APPLICATION_URL}/pharmacist`,
      customAttributes: {
        role: QrCodeRole.PHARMACIST,
      }
    }]
  }).asset
  console.info(`Prescription: `, JSON.stringify(prescription, ' ', 2))

  const {assetId} = prescription
  os.asset(assetId).contacts().create({
    firstName: "Doctor",
    emailAddress: "sidewalkQrClinic@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'CLINIC'}
  })
  console.info(`Doctor: `, JSON.stringify(doctor, ' ', 2))
  patient = await contacts.create({
    firstName: "Bertrand",
    lastName: "L",
    emailAddress: "bl1971@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'PATIENT'},
  })
  console.info(`Patient: `, JSON.stringify(patient, ' ', 2))
  pharmacist1 = await contacts.create({
    firstName: "Pharmacist 1",
    emailAddress: "pharma1@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'PHARMACY'},
  })
  console.info(`Pharmacist 1: `, JSON.stringify(pharmacist1, ' ', 2))
  pharmacist2 = await contacts.create({
    firstName: "Pharmacist 2",
    emailAddress: "pharma2@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'PHARMACY'},
  })
  console.info(`Pharmacist 2: `, JSON.stringify(pharmacist2, ' ', 2))
  pharmacist3 = await contacts.create({
    firstName: "Pharmacist 3",
    emailAddress: "pharma2@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'PHARMACY'},
  })
  console.info(`Pharmacist 3: `, JSON.stringify(pharmacist3, ' ', 2))
  pharmacists = [pharmacist1, pharmacist2, pharmacist3]

  const qrCodes = await os.asset(assetId).qrCodes().get()
  console.info(`Prescription: `, JSON.stringify(qrCodes, ' ', 2))
  // SMS TEMPLATES

  const codeForPatient = await os.project(PROJECT_ID).smsTemplates().create({
    body: `Please enter the following code to access your prescription, written by {asset.customAttributes.doctor} complete`,
    smsTemplateName: "validationComplete"
  })
  console.log(`SMS Template for patient: `, codeForPatient)

  const codeForPatient = await os.project(PROJECT_ID).smsTemplates().create({
    body: `Please enter the following code to access your prescription written by {asset.customAttributes.soilSampleId} complete`,
    smsTemplateName: "validationComplete"
  })
  console.log(`SMS Template for patient: `, codeForPatient)

  console.log("dataSubmitted", dataSubmitted)

    const fieldDataSubmitted = await os.project(process.env.PROJECT_ID).smsTemplates().create({
      body: "Your field's data has been submitted to the Deveron Cloud",
      smsTemplateName: "fieldDataSubmitted"
    })

    console.log("fieldDataSubmitted", fieldDataSubmitted)
  }

}

setUp()
  .then(createAsset)
  .then(showSetup)
  .catch(formatError)


