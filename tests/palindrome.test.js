const palindrome = require('../utils/for_testing').palindrome

describe('Palindrome', () => {
  test('Probando "a"', ()=>{
    const result = palindrome('a')
    expect(result).toBe('a')
  })
  
  test('Probando "react"', ()=>{
    const result = palindrome('react')
    expect(result).toBe('tcaer')
  })
  
  test('Probando "capicipac"', ()=>{
    const result = palindrome('capicipac')
    expect(result).toBe('capicipac')
  }) 
})