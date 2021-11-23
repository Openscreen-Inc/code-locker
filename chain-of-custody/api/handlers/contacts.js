const {Openscreen} = require('@openscreen/sdk')

const os = new Openscreen().config({
  key: process.env.OS_KEY,
  secret: process.env.OS_SECRET,
})

const getContactsByType = async (event) => {
  const type = event.pathParameters.type

  const contacts = await os.project(process.env.PROJECT_ID).contacts().get()
  const filtered = contacts.contacts.filter((contact) => contact.customAttributes.contactType === type)

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({filtered}),
  }
}

module.exports = {getContactsByType}
