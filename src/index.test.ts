import { getCityFromZip } from './index'

const mockGlobal: any = global
mockGlobal.zipcodeMapDK = {
  '2300': 'København S',
}

mockGlobal.zipcodeMapSE = {
  '18633': 'Vallentuna',
}

describe('Load dk country', () => {
  it('Returns the correct Danish city for zipcode 2300', async () => {
    const city = await getCityFromZip({ zipcode: 2300, country: 'DK', global: mockGlobal })
    expect(city).toEqual('København S')
  })
  it('Returns the correct Swedish city for zipcode 18633', async () => {
    const city = await getCityFromZip({ zipcode: '18 633', country: 'SE', global: mockGlobal })
    expect(city).toEqual('Vallentuna')
  })
  it('Returns false for an incorrect zipcode', async () => {
    const city = await getCityFromZip({ zipcode: 99999, country: 'DK', global: mockGlobal })
    expect(city).toEqual(false)
  })
})
