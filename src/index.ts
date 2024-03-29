import fetch from 'node-fetch'
import { TIsoCountry } from '@omnicar/sam-types'

/**
 *  NOTE:
 *  1. Create a new JSON-file with postal numbers for the new country + create
 *     tests for it.
 *  2. Place the new JSON-file into the directory "countries/" under "src/", so
 *     it can be tested locally.
 *  3. Also upload the new JSON-file to "SAM-admin-v2/public/data/zip-codes/"
 *     so it will work properly on remote clients.
 */
const searchDataLocations: string[] = ['./countries/', 'https://admin.omnicar.io/data/zip-codes/']

const isOnlySupportedCounties = false
const supportedCountries: TIsoCountry[] = ['DK', 'SE', 'FI', 'NO']

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
  const { isoCountryCode, global } = cityLookup

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
  if (isOnlySupportedCounties && !supportedCountries.includes(country)) {
    console.warn("Warning: This country with isoCode '" + country + "' is not supported")
    return false
  }

  let response: any = false
  let zipcodeMap: IZipCodes | false = false

  for (const path of searchDataLocations) {
    try {
      // Try first with loading as a remote asset (URL)!
      if (path.startsWith('http')) {
        response = await loadFile(path + country.toLowerCase() + '.json')
      }

      // If above fails, then try importing (as a local asset)!
      if (!response) {
        response = await import(path + country.toLowerCase() + '.json')
      }

      zipcodeMap = response.zipcodeMap
      return zipcodeMap
    } catch (err) {
      console.warn(
        'Warning: Failed loading zip-codes for isoCountry: ' + country + ', from: ' + path + ', ' + err?.message,
      )

      response = false
    }
  }

  return false
}

const loadFile = async (src: string) => {
  try {
    const response = await fetch(src)
    if (!response) return false

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (err) {
    console.log(err)
  }
}
