const app = require('./app')                                // linea basica
const http = require('http')                                // linea basica
const https = require('https')
const config = require('./utils/config')
const logger = require('./utils/logger')
const fs = require('fs')



// const server = http.createServer(app)

let server
if(config.ENABLE_SSL === 'true'){
  server = https.createServer({
    key: fs.readFileSync(config.SSL_KEY_FILE, 'utf8'),
    cert: fs.readFileSync(config.SSL_CERT_FILE, 'utf8')
  },
  app)
  console.log('SE CONFIGURA POR HTTPS')
}else{
  server = http.createServer(app)
  console.log('SE CONFIGURA SIN SSL')
}

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})



// server.listen(config.PORT, ()=>{                            // linea basica
//   logger.info(`Server running on port: ${config.PORT}`)
// })