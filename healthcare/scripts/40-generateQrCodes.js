#!/usr/bin/env node
const QrCodeRole = require('../common/ContactRoles')
const context = require('./context')

module.exports = async () => {
  const {osProject, osPrescription} = context
  const qrCodes = await osPrescription.qrCodes().get({
    format: 'PNG',
    scale: 12,
    dataUrl: false,
    lightColor: '#ffffff',
    darkColor: '#0066AA'
  })
  console.info(`QR Codes: `, JSON.stringify(qrCodes, ' ', 2))
}
