import { readdirSync, readFileSync } from 'fs'

describe('Check country files', () => {
  it('Verifies that all country files have the right format', async () => {
    const countryFolder = './src/countries'

    const files = readdirSync(countryFolder)
    files.forEach(f => {
      const fileContent = readFileSync(`${countryFolder}/${f}`, 'utf8')
      expect(fileContent.includes(`const zipcodeMap${f.toUpperCase()}`))
    })
  })
})
