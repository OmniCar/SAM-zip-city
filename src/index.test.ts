import { TIsoCountry } from '@omnicar/sam-types'
import { getCityFromZip, initZipCityCountry } from './index'

describe('Load mocked data', () => {
  const mockGlobal: any = {}
  mockGlobal.zipcodeMapDK = {
    '2300': 'København S',
  }
  mockGlobal.zipcodeMapSE = {
    '18633': 'Vallentuna',
  }

  it('Returns false for an incorrect zipcode', async () => {
    const city = await getCityFromZip({ zipcode: 9994646599, isoCountryCode: 'DK', global: mockGlobal })
    expect(city).toEqual(false)
  })
  it('Returns false for an incorrect zipcode', async () => {
    const city = await getCityFromZip({ zipcode: '0000', isoCountryCode: 'SE', global: mockGlobal })
    expect(city).toEqual(false)
  })
  it('Returns the correct Danish city for zipcode 2300', async () => {
    const city = await getCityFromZip({ zipcode: 2300, isoCountryCode: 'DK', global: mockGlobal })
    expect(city).toEqual('København S')
  })
  it('Returns the correct Swedish city for zipcode 18633', async () => {
    const city = await getCityFromZip({ zipcode: '18 633', isoCountryCode: 'SE', global: mockGlobal })
    expect(city).toEqual('Vallentuna')
  })
  it('Returns Ukrainian city <false> for unavailable country', async () => {
    const givenZipCode = 46564
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: 'UA' })
    const expectedCity = false

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns US city <false> for unavailable country', async () => {
    const givenZipCode = 46564
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: 'US' })
    const expectedCity = false

    expect(resultCity).toEqual(expectedCity)
  })
})

describe('Test Zip codes for Denmark (DK)', () => {
  const isoCountryDK: TIsoCountry = 'DK'

  beforeAll(() => {
    initZipCityCountry({ isoCountryCode: isoCountryDK })
  })

  it('Returns the correct Danish city <false> for zipcode 0', async () => {
    const givenZipCode = 0
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryDK })
    const expectedCity = false

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Danish city <false> for zipcode 99999', async () => {
    const givenZipCode = 99999
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryDK })
    const expectedCity = false

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Danish city København S for zipcode 2300', async () => {
    const givenZipCode = 2300
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryDK })
    const expectedCity = 'København S'

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Danish city Taastrup for zipcode "2630"', async () => {
    initZipCityCountry({ isoCountryCode: isoCountryDK })

    const givenZipCode = '2630'
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryDK })
    const expectedCity = 'Taastrup'

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Danish city Kastrup for zipcode "2770"', async () => {
    initZipCityCountry({ isoCountryCode: isoCountryDK })

    const givenZipCode = '2770'
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryDK })
    const expectedCity = 'Kastrup'

    expect(resultCity).toEqual(expectedCity)
  })
})

describe('Test Zip codes for Sweden (SE)', () => {
  const isoCountrySE: TIsoCountry = 'SE'

  beforeAll(() => {
    initZipCityCountry({ isoCountryCode: isoCountrySE })
  })

  it('Returns the correct Swedish city <false> for zipcode "0"', async () => {
    const givenZipCode = 0
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountrySE })
    const expectedCity = false

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Swedish city Mölndal for zipcode 431 49', async () => {
    const givenZipCode = 43149
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountrySE })
    const expectedCity = 'Mölndal'

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Swedish city Göteborg for zipcode 411 01', async () => {
    const givenZipCode = '411 01'
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountrySE })
    const expectedCity = 'Göteborg'

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Swedish city Fiskebäck for zipcode "42 158"', async () => {
    const givenZipCode = '42 158'
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountrySE })
    const expectedCity = 'Västra Frölunda'

    expect(resultCity).toEqual(expectedCity)
  })
})

describe('Test Zip codes for Finland (FI)', () => {
  const isoCountryFI: TIsoCountry = 'FI'

  beforeAll(() => {
    initZipCityCountry({ isoCountryCode: isoCountryFI })
  })

  it('Returns the correct Finnish city <false> for zipcode "0"', async () => {
    const givenZipCode = 0
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryFI })
    const expectedCity = false

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Finland city Espoo for zipcode "02600"', async () => {
    const givenZipCode = '02600'
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryFI })
    const expectedCity = 'Espoo'

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Finnish city Kemijärvi for zipcode 981 00', async () => {
    const givenZipCode = '981 00'
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryFI })
    const expectedCity = 'Kemijärvi'

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Finnish city Rovaniemi for zipcode 99999', async () => {
    const givenZipCode = 99999
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryFI })
    const expectedCity = 'Rovaniemi'

    expect(resultCity).toEqual(expectedCity)
  })
})

describe('Test Zip codes for Norway (NO)', () => {
  const isoCountryNO: TIsoCountry = 'NO'

  beforeAll(() => {
    initZipCityCountry({ isoCountryCode: isoCountryNO })
  })

  it('Returns the correct Norwegian city <false> for zipcode "000"', async () => {
    const givenZipCode = '000'
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryNO })
    const expectedCity = false

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Norwegian city Skedsmokorset for zipcode "2019"', async () => {
    const givenZipCode = '2019'
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryNO })
    const expectedCity = 'Skedsmokorset'

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Norwegian city Oslo for zipcode 0010', async () => {
    const givenZipCode = '0010'
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryNO })
    const expectedCity = 'Oslo'

    expect(resultCity).toEqual(expectedCity)
  })
  it('Returns the correct Norwegian city Tromsø for zipcode 9009', async () => {
    const givenZipCode = 9009
    const resultCity = await getCityFromZip({ zipcode: givenZipCode, isoCountryCode: isoCountryNO })
    const expectedCity = 'Tromsø'

    expect(resultCity).toEqual(expectedCity)
  })
})
