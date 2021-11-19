//------------------------------------------------------------ Global Imports --
import httpError from 'http-errors'
import DynamoDB from 'aws-sdk/clients/dynamodb'

//---------------------------------------------------------- Relative Imports --
import {uuid, pass, fail} from '../lib'

//----------------------------------------------------------------- Constants --
export const STATUS = {
  AVAILABLE: 'AVAILABLE',
  BOOKED: 'BOOKED',
  CUSTOMER: 'CUSTOMER',
  REPAIR: 'REPAIR',
  TRANSIT: 'TRANSIT',
}

export const CONDITION = {GOOD: 'GOOD', USED: 'USED', DAMAGED: 'DAMAGED'}

const {env} = process

const REGION = env.REGION || env.AWS_REGION || 'us-east-1'
const TableName = env.TABLE_NAME || 'supplychain-inventory-demo'

//----------------------------------------------------------------- Inventory --
export class Inventory {
  constructor(input = {}) {
    const {local, ...rest} = input

    const config = {
      region: REGION,
      apiVersion: '2012-08-10',
      endpoint: local || env.LOCAL ? 'http://localhost:8000' : `https://dynamodb.${REGION}.amazonaws.com`,
      params: {TableName},
      ...rest,
    }

    this.db = new DynamoDB.DocumentClient(config)
  }

  //------------------------------------------------------------------- get ----
  get(id) {
    return this.db
      .get({Key: {id}})
      .promise()
      .then(({Item}) => (Item ? pass(Item) : fail(httpError(404, `Item with id '${id}' does not exist`))))
      .catch(fail)
  }

  //---------------------------------------------------------------- delete ----
  delete(id) {
    return this.db.delete({Key: {id}}).promise().then(pass).catch(fail)
  }

  //------------------------------------------------------------------ scan ----
  scan() {
    return this.db
      .scan()
      .promise()
      .then(({Items}) => pass(Items))
      .catch(fail)
  }

  //---------------------------------------------------------------- create ----
  create({id, type, name, description, qrcode}) {
    if (!type) {
      return fail(httpError(400, "The property field 'type' must be defined"))
    }

    const params = {
      ConditionExpression: 'attribute_not_exists(#id)',
      ExpressionAttributeNames: {'#id': 'id'},
      Item: {
        id: id ?? uuid(),
        type,
        name,
        description,
        status: STATUS.AVAILABLE,
        condition: CONDITION.GOOD,
        qrcode,
      },
    }

    return this.db
      .put(params)
      .promise()
      .then(() => pass(params.Item))
      .catch(fail)
  }

  //---------------------------------------------------------------- update ----
  update({id, type, status, condition, renter}) {
    const params = {
      Key: {id},
      ReturnValues: 'ALL_NEW',
      ConditionExpression: 'attribute_exists(#id)',
      UpdateExpression: `SET #t = :t, #s = :s, #c = :c, #r = :r`,
      ExpressionAttributeNames: {
        '#id': 'id',
        '#t': 'type',
        '#s': 'status',
        '#c': 'condition',
        '#r': 'renter',
      },
      ExpressionAttributeValues: {
        ':t': type,
        ':s': status,
        ':c': condition,
        ':r': renter,
      },
    }

    return this.db
      .update(params)
      .promise()
      .then(({Attributes}) => pass(Attributes))
      .catch(fail)
  }
}

export default Inventory
