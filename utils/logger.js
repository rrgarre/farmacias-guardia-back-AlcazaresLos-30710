// Metodo para mensajes de consola
const info = (...params) => {
  console.log(...params)
}
// Metodo para mensajes de error en consola
const error = (...params) => {
  console.error(...params)
}

module.exports = {
  info,
  error
}