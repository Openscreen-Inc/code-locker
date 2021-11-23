#!/usr/bin/env node
const context = require('./00-context')
const createSmsTemplates = require('./10-createSmsTemplates')
const createPrescription = require('./20-createPrescription')
const createContacts = require('./30-createContacts')
const generateQrCodes = require('./40-generateQrCodes')


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
  await createSmsTemplates()
  await createPrescription()
  await createContacts()
  await generateQrCodes()
}


setUp().catch(formatError)
