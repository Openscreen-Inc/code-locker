const dotenv = require('dotenv')
const {fromIni} = require('@aws-sdk/credential-provider-ini')
const {CreateTableCommand, DynamoDBClient, ListTablesCommand, DeleteTableCommand} = require('@aws-sdk/client-dynamodb')

const {REGION, TABLE_NAME} = dotenv.config({path: '../.env'}).parsed

const TableName = TABLE_NAME

const config = {
  region: REGION ?? 'us-east-1',
  apiVersion: '2012-08-10',
  endpoint: 'http://localhost:8000',
  credentials: fromIni({profile: 'local'}), // Assumes AWS named profile "local" to connect to dynamodb local
}

const dbLocal = new DynamoDBClient(config)

//--------------------------------------------------------------- deleteTable --
function deleteTable(client) {
  return client.send(new DeleteTableCommand({TableName}))
}

//--------------------------------------------------------------- createTable --
function createTable(client) {
  return client.send(
    new CreateTableCommand({
      TableName,
      BillingMode: 'PAY_PER_REQUEST',
      AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'S'}],
      KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
    }),
  )
}

//---------------------------------------------------------------- listTables --
function listTables(client) {
  return client.send(new ListTablesCommand({}))
}

//---------------------------------------------------------------------- main --
async function main() {
  //const response = await listTables(dbLocal)
  //const response = await deleteTable(dbLocal)
  const response = await createTable(dbLocal)
  console.log(response)
}

main().catch(console.error)

module.exports = {createTable, deleteTable, listTables}
