import { loadScript } from './loadScript'

export type Country = 'DK' | 'SE'

export interface IZipCodes {
  [key: string]: string
}

export type ZipCodeMap = { [key in Country]?: IZipCodes }

let zipcodeCache: ZipCodeMap = {}

export interface ICityLookup {
  zipcode: number | string
  country: Country
  fileLocation?: string
  global?: any
}

export type CityConf = Pick<ICityLookup, 'country' | 'fileLocation' | 'global'>

export const getCityFromZip = async (cityLookup: ICityLookup) => {
  const { zipcode } = {
    ...cityLookup,
  }
  const countryMap = await initZipCityCountry(cityLookup)
  if (!countryMap) {
    return false
  }
  const zipKey = `${zipcode}`.replace(' ', '')
  const cityName = countryMap.hasOwnProperty(zipKey) ? countryMap[zipKey] : false
  return cityName
}

const defaultFileLocation = 'https://cdn.jsdelivr.net/gh/omnicar/sam-zip-city/dist/countries/'

export const initZipCityCountry = async (cityLookup: CityConf): Promise<IZipCodes | undefined> => {
  const { country, fileLocation = defaultFileLocation, global } = cityLookup
  if (zipcodeCache[country]) {
    return zipcodeCache[country]
  }
  const myGlobal: any = global || window
  let zipcodeCountryMap = getZipcodeMapFromGlobal(myGlobal, country)
  if (zipcodeCountryMap) {
    return zipcodeCountryMap
  }
  // Load the script asynchronously
  const scriptPath = `${fileLocation!}${country.toLowerCase()}.js`
  await loadScript(scriptPath, `zipCity-${country}'`)
  // Check again if the variable is available
  zipcodeCountryMap = getZipcodeMapFromGlobal(myGlobal, country)
  if (zipcodeCountryMap) {
    return zipcodeCountryMap
  }
  return undefined
}

const getZipcodeMapFromGlobal = (global: any, country: Country) => {
  const zipcodeCountryMap = global[`zipcodeMap${country}`]
  if (zipcodeCountryMap) {
    zipcodeCache[country] = zipcodeCountryMap
    return zipcodeCountryMap
  }
}
