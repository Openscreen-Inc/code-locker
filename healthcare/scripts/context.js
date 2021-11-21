const {OS_KEY, OS_SECRET, PROJECT_ID} = process.env
const {Openscreen, QrCodeIntentType} = require('@openscreen/sdk')
const os = new Openscreen().config({key: OS_KEY, secret: OS_SECRET})
const osProject = os.project(PROJECT_ID)

module.exports = {
  os,
  osProject,
  osAssets: null,
  osAsset: null,
  osContacts: null,
  doctor: null,
  patient: null,
  pharmacist1: null,
  pharmacist2: null,
  pharmacist3: null,
  pharmacists: null,
  prescription: null,
  qrCodes: null,
  patientQrCode: null,
  pharmacistQrCode: null,
}
