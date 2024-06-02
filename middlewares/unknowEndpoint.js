// unknown Endpoint
module.exports = (request, response) => {
  console.log('XXX middleware: unknowEndpoint')
  response.status(404).send({error: "unknow endpoint"})
}