const QrCodeRole = require('../common/ContactRoles')
const context = require('./context')

module.exports = async () => {

  const {osPrescription} = context
  const osContacts = osPrescription.contacts()


  const doctor = await osContacts.create({
    firstName: "Doctor",
    emailAddress: "sidewalkQrDr@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    type: QrCodeRole.DOCTOR,
  })
  console.info(`Doctor: `, JSON.stringify(doctor, ' ', 2))


  const patient = await osContacts.create({
    firstName: "Bertrand",
    lastName: "L",
    emailAddress: "sidewalkQrPatient@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    type: QrCodeRole.PATIENT,
  })
  console.info(`Patient: `, JSON.stringify(patient, ' ', 2))


  const pharmacist1 = await osContacts.create({
    firstName: "Pharmacist 1",
    emailAddress: "sidewalkQrPharma1@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    type: QrCodeRole.PHARMACIST,
  })
  console.info(`Pharmacist 1: `, JSON.stringify(pharmacist1, ' ', 2))


  const pharmacist2 = await osContacts.create({
    firstName: "Pharmacist 2",
    emailAddress: "sidewalkQrPharma2@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    type: QrCodeRole.PHARMACIST,
  })
  console.info(`Pharmacist 2: `, JSON.stringify(pharmacist2, ' ', 2))


  const pharmacist3 = await osContacts.create({
    firstName: "Pharmacist 3",
    emailAddress: "sidewalkQrPharma3@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    type: QrCodeRole.PHARMACIST,
  })
  console.info(`Pharmacist 3: `, JSON.stringify(pharmacist3, ' ', 2))


  context.assign({doctor, patient})
}
