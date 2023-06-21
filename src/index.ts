import { TIsoCountry } from '@omnicar/sam-types'

const supportedCountries: TIsoCountry[] = ['DK', 'SE']

export interface IZipCodes {
  [key: string]: string
}

export type ZipCodeMap = { [key in TIsoCountry]?: IZipCodes }

let zipcodeCache: ZipCodeMap = {}

export interface ICityLookup {
  zipcode: number | string
  isoCountryCode: TIsoCountry
  fileLocation?: string
  global?: any
}

export type CityConf = Pick<ICityLookup, 'isoCountryCode' | 'fileLocation' | 'global'>

const defaultFileLocation = 'https://cdn.jsdelivr.net/gh/omnicar/sam-zip-city/dist/countries/'

export const initZipCityCountry = async (cityLookup: CityConf): Promise<IZipCodes | undefined> => {
  const { isoCountryCode, fileLocation = defaultFileLocation, global } = cityLookup

  if (zipcodeCache[isoCountryCode]) {
    return zipcodeCache[isoCountryCode]
  }

  const myGlobal: any = global || window
  let zipcodeCountryMap = getZipcodeMapFromGlobal(myGlobal, isoCountryCode)

  if (zipcodeCountryMap) {
    return zipcodeCountryMap
  }

  const result = await loadCountryMap(isoCountryCode)
  if (!result) {
    return undefined
  }

  myGlobal[isoCountryCode] = result.zipcodeMap

  // Check again if the variable is available.
  zipcodeCountryMap = getZipcodeMapFromGlobal(myGlobal, isoCountryCode)

  if (zipcodeCountryMap) {
    return zipcodeCountryMap
  }

  return undefined
}

export const getCityFromZip = async (cityLookup: ICityLookup): Promise<string | false> => {
  const { zipcode } = cityLookup

  const countryMap = await initZipCityCountry(cityLookup)
  if (!countryMap) {
    return false
  }

  const zipcodeMap = countryMap
  const zipKey: any = `${zipcode}`.replace(' ', '')
  const cityName = zipcodeMap.hasOwnProperty(zipKey) ? zipcodeMap[zipKey] : false

  return cityName
}

const getZipcodeMapFromGlobal = (global: any, country: TIsoCountry) => {
  const zipcodeCountryMap = global[country]

  if (zipcodeCountryMap) {
    zipcodeCache[country] = zipcodeCountryMap as IZipCodes

    return zipcodeCountryMap
  }
}

const loadCountryMap = async (country: TIsoCountry): Promise<IZipCodes | false> => {
  let zipcodeMap: IZipCodes | false = false
  try {
    zipcodeMap = await import('./countries/' + country + '.ts') // Dynamic importing.
  } catch (err) {
    console.warn('Warning: Failed importing zipcodeMap for isoCountry: ' + country + ', ' + err?.message)
    return false
  }
  return zipcodeMap
}
