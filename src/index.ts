import fetch from 'node-fetch'
import { TIsoCountry } from '@omnicar/sam-types'

const isFetchJsonLocally = false

// JSON-files needs to be uploaded to "SAM-admin-v2/public/data/zip-codes/"
const searchDataLocations: string[] = [/*'./countries/',*/ 'https://admin.omnicar.io/data/zip-codes/']

const isAllowOnlySupportedCounties = false
const supportedCountries: TIsoCountry[] = ['DK', 'SE', 'FI']

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

export const initZipCityCountry = async (cityLookup: CityConf): Promise<IZipCodes | undefined> => {
  const { isoCountryCode, fileLocation = searchDataLocations, global } = cityLookup

  if (zipcodeCache[isoCountryCode]) {
    return zipcodeCache[isoCountryCode]
  }

  const myGlobal: any = global || window
  let zipcodeCountryMap = getZipcodeMapFromGlobal(myGlobal, isoCountryCode)

  if (zipcodeCountryMap) {
    return zipcodeCountryMap
  }

  const zipcodeMap = await loadCountryMap(isoCountryCode)
  if (!zipcodeMap) {
    return undefined
  }

  myGlobal[isoCountryCode] = zipcodeMap

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
  if (isAllowOnlySupportedCounties && !supportedCountries.includes(country)) {
    console.warn("Warning: This country with isoCode '" + country + "' is not supported")
    return false
  }

  let response: any = false
  let zipcodeMap: IZipCodes | false = false

  for (const path of searchDataLocations) {
    try {
      if (isFetchJsonLocally) {
        response = await import('./countries/' + country + '.json')
      } else {
        response = await loadFile(path + country.toLowerCase() + '.json')
      }
      zipcodeMap = response.zipcodeMap

      return zipcodeMap
    } catch (err) {
      console.warn(
        'Warning: Failed importing zip-codes for isoCountry: ' + country + ', from: ' + path + ', ' + err?.message,
      )

      response = false
    }
  }

  return false
}

const loadFile = async (src: string) => {
  try {
    const response = await fetch(src)

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (err) {
    console.log(err)
  }
}
