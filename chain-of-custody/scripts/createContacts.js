require('dotenv').config()
const {Openscreen} = require('@openscreen/sdk')

const os = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
})

const createContacts = async () => {
  try {
    const farmer = await os
      .project(process.env.PROJECT_ID)
      .contacts()
      .create({
        firstName: 'Jimmy',
        lastName: 'Farmsalot',
        emailAddress: 'vd@test.com',
        cellPhone: '+14444444444', // REPLACE THIS
        customAttributes: {
          companyName: 'Jakes Farm',
          contactType: 'farmer',
          farmName: 'jakes farm',
          assetCollector: '123',
          assetField: '123',
        },
      })

    log('farmer:', farmer)

    const agronomist = await os
      .project(process.env.PROJECT_ID)
      .contacts()
      .create({
        firstName: 'Sarah',
        lastName: 'Soils',
        cellPhone: '+14444444444', // REPLACE THIS
        emailAddress: 'bsmith@test.com',
        customAttributes: {
          contactType: 'agronomist',
          assetCollector: '123',
          assetField: '123',
        },
      })

    log('agronomist:', agronomist)

    const labtech = await os
      .project(process.env.PROJECT_ID)
      .contacts()
      .create({
        firstName: 'Jane',
        lastName: 'Testtube',
        cellPhone: '+14444444444', // REPLACE THIS
        emailAddress: 'bsmith@test.com',
        customAttributes: {
          contactType: 'labtech',
          companyName: 'Jakes Lab',
          assetCollector: '123',
          assetField: '123',
        },
      })

    log('labtech:', labtech)

    const validator = await os
      .project(process.env.PROJECT_ID)
      .contacts()
      .create({
        firstName: 'Kyle',
        lastName: 'Carbon',
        cellPhone: '+14444444444',
        emailAddress: 'bsmith@test.com',
        customAttributes: {
          contactType: 'validator',
          companyName: 'Jakes Lab',
          assetCollector: '123',
          assetField: '123',
        },
      })

    log('validator:', validator)
  } catch (error) {
    console.log(error)
  }
}

createContacts()

function log(name, data) {
  console.log(name, JSON.stringify(data, null, 2))
}
