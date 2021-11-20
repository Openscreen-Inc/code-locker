#!/usr/bin/env node
const {Openscreen} = require('@openscreen/sdk')

const formatError = require('format-error')
const configstore = require('configstore')

require('dotenv').config()
const {OS_PROJECT, OS_KEY, OS_SECRET, OS_DEBUG} = process.env

const createContacts = async () => {

  const configstore = new Configstore('health-care')
  
  const os = new Openscreen().config({key: OS_KEY, secret: OS_SECRET})
  const contacts = os.project(process.env.PROJECT_ID).contacts()

  const clinic = await contacts.create({
    firstName: "SidewalkQR",
    lastName: "Clinic",
    emailAddress: "sidewalkQrClinic@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'CLINIC'}
  })
  configstore.setItem('clinic', clinic.contactId)

  const pharmacy1 = await contacts.create({
    firstName: "Pharmacist",
    lastName: "1",
    emailAddress: "pharma1@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'PHARMACY'},
  })
  const pharmacy2 = await contacts.create({
    firstName: "Pharmacist",
    lastName: "2",
    emailAddress: "pharma2@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'PHARMACY'},
  })
  const pharmacy3 = await contacts.create({
    firstName: "Pharmacist",
    lastName: "3",
    emailAddress: "pharma2@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'PHARMACY'},
  })
  configstore.setItem('pharmacy', [
    pharmacy1.contactId,
    pharmacy2.contactId,
    pharmacy3.contactId,
  ])

  const patient = await contacts.create({
    firstName: "Bertrand",
    lastName: "L",
    emailAddress: "bl1971@mailinator.com",
    cellPhone: "+14444444444", // REPLACE THIS
    customAttributes: {role: 'PATIENT'},
  })
  configstore.setItem('patient', patient.contactId)

  console.info(`Doctor: `, JSON.stringify(clinic, ' ', 2))
  console.info(`Pharmacist 1: `, JSON.stringify(pharmacy1, ' ', 2))
  console.info(`Pharmacist 2: `, JSON.stringify(pharmacy2, ' ', 2))
  console.info(`Pharmacist 3: `, JSON.stringify(pharmacy3, ' ', 2))
  console.info(`Patient: `, JSON.stringify(patient, ' ', 2))
}

createContacts().catch(formatError)
