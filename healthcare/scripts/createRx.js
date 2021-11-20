#!/usr/bin/env node
const fs = require('fs').promises
const {Openscreen} = require('@openscreen/sdk')

const formatError = require('format-error')
const configstore = require('configstore')

require('dotenv').config()
const {OS_PROJECT, OS_KEY, OS_SECRET, OS_DEBUG} = process.env

const createRx = async () => {

  const rxPdf = await fs.readFile('rx.pdf');
  const pdf = new Buffer(rxPdf).toString('base64');

  const assets = os.project(process.env.PROJECT_ID).assets()
  const {asset: prescription} = await assets.create({
    name: 'Rx',
    description: '',
    customAttributes: {
      pdf,
      state: 'RX_ISSUED'
    },
    qrCodes: [{
      intentType: 'DYNAMIC_REDIRECT_TO_APP',
      intent: `${APPLICATION_URL}/clinic`,
    },{
      intentType: 'DYNAMIC_REDIRECT_TO_APP',
      intent: `${APPLICATION_URL}/patient`,
    },{
      intentType: 'DYNAMIC_REDIRECT_TO_APP',
      intent: `${APPLICATION_URL}/pharmacist`,
    }]
  })

  console.info(`Prescription: `, JSON.stringify(doctor, ' ', 2))
}

createRx().catch(formatError)
