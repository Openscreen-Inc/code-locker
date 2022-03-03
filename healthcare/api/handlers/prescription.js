const {Openscreen} = require('@openscreen/sdk')

const {debug, response, pdfResponse, pngResponse, currentStateMessage} = require('./lib/util')
const {PrescriptionStates, ContactRoles, TemplateNames, QrCodeTypes} = require('./lib/constants')

const {OS_KEY, OS_SECRET, API_ENDPOINT, PHONE_OVERRIDE, DEBUG} = process.env

const os = new Openscreen().config({
  key: OS_KEY,
  secret: OS_SECRET,
  // DON'T WORRY ABOUT OS_ENV. YOUR SDK WILL CONNECT
  // TO OUR PRODUCTION SERVERS AUTOMATICALLY.
  environment: process.env.OS_ENV,
})

const isPharmacist = (contact) => contact.type === ContactRoles.PHARMACIST

function validatePhone(phone, description) {
  if (!phone) throw Error(`Missing ${description}`)
  if (/\+1[0-9]{10}/.test(phone)) return phone
  if (/\+1-[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(phone)) return phone.split('-').join('')
  if (/[0-9]{10}/.test(phone)) return `+1${phone}`
  if (/[0-9]{3}-[0-9]{3}-[0-9]{4}/.test(phone)) return `+1${phone.split('-').join('')}`
  throw Error(`Invalid ${description}`)
}

/***
 * GET /prescription?scanId=pppppppp-pppp-pppp-pppp-pppppppppppp
 */
exports.getPrescription = async (event) => {
  debug(`EVENT ${JSON.stringify(event)}`)

  const {scanId} = event.queryStringParameters
  const {asset: prescription, qrCode, contacts} = await os.scan(scanId).get()
  const {customAttributes} = prescription
  const {state, clinic, patient, pharmacy, pdf} = customAttributes

  switch (qrCode.intentState.qrType) {
    case QrCodeTypes.PRESCRIPTION_QR:
      switch (state) {
        case PrescriptionStates.PRESCRIPTION_CREATED:
          return response({state, clinic, patient, pharmacies: contacts.filter(isPharmacist)})
        default:
          return currentStateMessage(state, pharmacy)
      }

    default:
      return response({}, 501)
  }
}

/***
 * GET /pickup?scanId=pppppppp-pppp-pppp-pppp-pppppppppppp
 */
exports.getPickup = async (event) => {
  debug(`EVENT ${JSON.stringify(event)}`)

  const {scanId} = event.queryStringParameters
  const {asset: prescription, qrCode, contacts} = await os.scan(scanId).get()

  const {customAttributes} = prescription
  const {state, clinic, patient, pharmacy, pdf} = customAttributes

  switch (qrCode.intentState.qrType) {
    case QrCodeTypes.PICKUP_QR:
      switch (state) {
        case PrescriptionStates.PRESCRIPTION_READY:
          await os.asset(prescription.assetId).update({
            customAttributes: {
              state: PrescriptionStates.PRESCRIPTION_PICKED_UP,
            },
          })

          return pdfResponse(pdf, patient)
        default:
          return currentStateMessage(state, pharmacy)
      }

    default:
      return response({}, 501)
  }
}

/***
 * GET /prescription/pppppppp-pppp-pppp-pppp-pppppppppppp/prepare
 */
exports.getPrescriptionPrepare = async (event) => {
  debug(`EVENT ${JSON.stringify(event)}`)

  const {scanId} = event.pathParameters
  const {asset: prescription, qrCode} = await os.scan(scanId).get()
  const {customAttributes} = prescription

  if (qrCode.intentState.qrType === QrCodeTypes.PRESCRIPTION_QR) {
    const {state, patientPhone, clinic, pdf, pharmacy} = customAttributes

    switch (state) {
      case PrescriptionStates.PRESCRIPTION_ACCEPTED_BY_PATIENT:
        await os.asset(prescription.assetId).update({
          customAttributes: {
            state: PrescriptionStates.PRESCRIPTION_ACCEPTED_BY_PHARMACIST,
          },
        })

        await os
          .scan(scanId)
          .sms()
          .send({
            to: PHONE_OVERRIDE || patientPhone,
            smsTemplateName: TemplateNames.PRESCRIPTION_BEING_PREPARED,
            customVariables: {clinic, pharmacy},
          })

        return pdfResponse(pdf, pharmacy)

      default:
        return currentStateMessage(state, pharmacy)
    }
  }

  return response({}, 501)
}

/***
 * GET /prescription/pppppppp-pppp-pppp-pppp-pppppppppppp/ready
 */
exports.getPrescriptionReady = async (event) => {
  debug(`EVENT ${JSON.stringify(event)}`)

  const {scanId} = event.pathParameters
  const {asset: prescription, qrCode} = await os.scan(scanId).get()

  if (qrCode.intentState.qrType === QrCodeTypes.PRESCRIPTION_QR) {
    const {customAttributes} = prescription
    const {patientPhone, clinic, pharmacy} = customAttributes

    switch (customAttributes.state) {
      case PrescriptionStates.PRESCRIPTION_ACCEPTED_BY_PHARMACIST:
        await os.asset(prescription.assetId).update({
          customAttributes: {
            state: PrescriptionStates.PRESCRIPTION_READY,
          },
        })
        await os
          .scan(scanId)
          .sms()
          .send({
            to: PHONE_OVERRIDE || patientPhone,
            smsTemplateName: TemplateNames.PRESCRIPTION_READY_FOR_PICKUP,
            customVariables: {
              clinic,
              pharmacy,
              link: `${API_ENDPOINT}/prescription/${scanId}/pickupqr`,
            },
          })
        return currentStateMessage(PrescriptionStates.PRESCRIPTION_READY, pharmacy, 200)

      default:
        return currentStateMessage(customAttributes.state, pharmacy)
    }
  }

  return response({}, 501)
}

/***
 * GET /prescription/pppppppp-pppp-pppp-pppp-pppppppppppp/pickupqr
 */
exports.getPrescriptionPickupQr = async (event) => {
  debug(`EVENT ${JSON.stringify(event)}`)

  const {scanId} = event.pathParameters
  const {asset: prescription, qrCode} = await os.scan(scanId).get()

  if (qrCode.intentState.qrType === QrCodeTypes.PRESCRIPTION_QR) {
    const {customAttributes} = prescription
    const {state, pickupQrCodeId, pharmacy} = customAttributes

    switch (state) {
      case PrescriptionStates.PRESCRIPTION_READY: {
        const pickupQrCode = await os.qrCode(customAttributes.pickupQrCodeId).get()
        return pngResponse(pickupQrCode.image.data)
      }
      default:
        return currentStateMessage(state, pharmacy)
    }
  }

  return response({}, 501)
}

/***
 * PATCH /prescription?scanId=pppppppp-pppp-pppp-pppp-pppppppppppp&patientPhone=+12223334444&pharmacyPhone=+12223334444
 */
exports.updatePrescription = async (event) => {
  debug(`EVENT ${JSON.stringify(event)}`)

  const {scanId} = event.queryStringParameters
  let {patientPhone, pharmacyPhone} = event.queryStringParameters
  const {asset: prescription, qrCode, contacts} = await os.scan(scanId).get()

  patientPhone = validatePhone(patientPhone, 'patientPhone')
  pharmacyPhone = validatePhone(pharmacyPhone, 'pharmacyPhone')

  if (qrCode.intentState.qrType === QrCodeTypes.PRESCRIPTION_QR) {
    const {customAttributes} = prescription
    const {state, patient, pdf, clinic} = customAttributes

    switch (state) {
      case PrescriptionStates.PRESCRIPTION_CREATED: {
        if (customAttributes.patientPhone !== patientPhone) {
          return response({error: `Patient phone number does not match prescription`}, 400)
        }

        const [pharmacy] = contacts.filter((contact) => isPharmacist(contact) && contact.cellPhone === pharmacyPhone)

        if (!pharmacy) {
          return response({error: `Pharmacy phone number cannot be found in the list of pharmacies`}, 400)
        }

        await os.asset(prescription.assetId).update({
          customAttributes: {
            state: PrescriptionStates.PRESCRIPTION_ACCEPTED_BY_PATIENT,
            pharmacy: pharmacy.firstName,
            pharmacyPhone,
          },
        })

        await os
          .scan(scanId)
          .sms()
          .send({
            to: PHONE_OVERRIDE || pharmacyPhone,
            smsTemplateName: TemplateNames.PRESCRIPTION_DROP_OFF,
            customVariables: {
              patient,
              link1: `${API_ENDPOINT}/prescription/${scanId}/prepare`,
              link2: `${API_ENDPOINT}/prescription/${scanId}/ready`,
            },
          })
        return pdfResponse(pdf, clinic)
      }

      default:
        return currentStateMessage(state, '')
    }
  }

  return response({}, 501)
}
