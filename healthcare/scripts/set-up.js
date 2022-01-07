#!/usr/bin/env node
require = require('esm')(module)
const context = require('./00-context')
const createSmsTemplates = require('./10-createSmsTemplates')
const createPrescription = require('./20-createPrescription')
const createContacts = require('./30-createContacts')
const generateQrCodes = require('./40-generateQrCodes')

const setUp = async () => {
  await createSmsTemplates()
  await createPrescription()
  await createContacts()
  await generateQrCodes()
}

setUp().catch(err => {
  if (err.entityType === 'entity.response') {
    console.error(JSON.stringify(err, ' ', 2))
  } else {
    console.error(err)
  }
})
