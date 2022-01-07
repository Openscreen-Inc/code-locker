#!/usr/bin/env node
const QrCodeRole = require('../common/ContactRoles')
const context = require('./00-context')

module.exports = async () => {
  const {os,  osPrescription} = context
  const response = await osPrescription.qrCodes().get({
    format: 'PNG',
    scale: 12,
    dataUrl: false,
    lightColor: '#ffffff',
    darkColor: '#0066AA'
  })
  const {qrCodes} = response
  Promise.all(qrCodes.map(qrCode => os.saveQrImageDataToFile(qrCode)))
}
