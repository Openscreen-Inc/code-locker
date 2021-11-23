const QrCodeRole = require('../common/ContactRoles')
const context = require('./00-context')

module.exports = async () => {

  const {osPrescription} = context
  let {doctor, patient, pharmacist1, pharmacist2, pharmacist3} = context
  const osContacts = osPrescription.contacts()
  let response

  response = await osContacts.create(doctor)
  doctor = response.contact
  console.info(`Doctor: `, JSON.stringify(doctor, ' ', 2))


  response = await osContacts.create(patient)
  patient = response.contact
  console.info(`Patient: `, JSON.stringify(patient, ' ', 2))


  response = await osContacts.create(pharmacist1)
  pharmacist1 = response.contact
  console.info(`Pharmacist 1: `, JSON.stringify(pharmacist1, ' ', 2))


  response = await osContacts.create(pharmacist2)
  pharmacist2 = response.contact
  console.info(`Pharmacist 2: `, JSON.stringify(pharmacist2, ' ', 2))


  response = await osContacts.create(pharmacist3)
  pharmacist3 = response.contact
  console.info(`Pharmacist 3: `, JSON.stringify(pharmacist3, ' ', 2))
}
