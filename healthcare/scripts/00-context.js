require('dotenv').config()
const {OS_EMAIL, OS_PASSWORD, OS_KEY, OS_SECRET, OS_ENV, PROJECT_ID} = process.env
const {Openscreen} = require('@openscreen/sdk')
const {Configstore} = require('./configstore')
const storage = new Configstore('openscreen')
const ContactRoles = require('../common/ContactRoles')
const os = new Openscreen().config({key: OS_KEY, secret: OS_SECRET, environment: OS_ENV, storage})
const osProject = os.project(PROJECT_ID)

const uniquePhone = (root) => {
  return root + `000${Math.floor(Math.random() * 10000)}`.substr(-4)
}

const uniqueEmail = (root, domain) => {
  return root + `0000000${Math.floor(Math.random() * 100000000)}`.substr(-8) + '@' + domain
}

module.exports = {
  os,
  osProject,
  doctor: {
    firstName: 'Doctor',
    emailAddress: uniqueEmail('Dr', 'mailinator.com'),
    cellPhone: uniquePhone('+1647489'), // REPLACE THIS
    type: ContactRoles.DOCTOR,
  },
  patient: {
    firstName: 'Bertrand',
    lastName: 'L',
    emailAddress: uniqueEmail('Patient', 'mailinator.com'),
    cellPhone: uniquePhone('+1416973'), // REPLACE THIS
    type: ContactRoles.PATIENT,
  },
  pharmacist1: {
    firstName: 'Pharmacist 1',
    emailAddress: uniqueEmail('Pharmacist', 'mailinator.com'),
    cellPhone: uniquePhone('+1416703'), // REPLACE THIS
    type: ContactRoles.PHARMACIST,
  },
  pharmacist2: {
    firstName: 'Pharmacist 2',
    emailAddress: uniqueEmail('Pharmacist', 'mailinator.com'),
    cellPhone: uniquePhone('+1647898'), // REPLACE THIS
    type: ContactRoles.PHARMACIST,
  },
  pharmacist3: {
    firstName: 'Pharmacist 3',
    emailAddress: uniqueEmail('Pharmacist', 'mailinator.com'),
    cellPhone: uniquePhone('+1647898'), // REPLACE THIS
    type: ContactRoles.PHARMACIST,
  },
}
