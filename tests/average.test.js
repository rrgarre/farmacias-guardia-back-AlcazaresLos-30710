const average = require('../utils/for_testing').average

describe('Average', () => {
  test('De un valor es el mismo valor', () => {
    expect(average([1])).toBe(1)
  })
  test('De un array de valores, el resultado correcto', () => {
    expect(average([1,2,3,4,5,6])).toBe(3.5)
  })
  test('De un array vacío, debe ser 0', () => {
    expect(average([])).toBe(0)
  })
})