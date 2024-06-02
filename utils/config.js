require('dotenv').config()

const PORT = process.env.PORT

// DDBB MongoBD
const MONGODB_URI = process.env.MONGODB_URI

// SQL DDBB
const DDBB_NAME = process.env.DDBB_NAME
const DDBB_USER = process.env.DDBB_USER
const DDBB_PASSWORD = process.env.DDBB_PASSWORD
const DDBB_HOST = process.env.DDBB_HOST

if(process.env.NODE_ENV === "test"){
  console.log('estamos en modo test:..............')
  const MONGODB_URI = process.env.MONGODB_URI_TEST
}
const SECRET_FOR_JWT = process.env.SECRET_FOR_JWT
const ENABLE_SSL = process.env.RR_ENABLE_SSL
const SSL_KEY_FILE = process.env.RR_SSL_KEY_FILE
const SSL_CERT_FILE = process.env.RR_SSL_CERT_FILE

module.exports = {
  PORT,
  MONGODB_URI,
  SECRET_FOR_JWT,
  ENABLE_SSL,
  SSL_KEY_FILE,
  SSL_CERT_FILE,
  DDBB_NAME,
  DDBB_USER,
  DDBB_PASSWORD,
  DDBB_HOST
}