module.exports = (body, statusCode = 200) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
  }
  if (typeof body !== 'string') body = JSON.stringify(body)
  return {statusCode, headers, body}
}
