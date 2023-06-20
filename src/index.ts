import { IsoLocale } from '@omnicar/sam-types'

export type Country = 'DK' | 'SE'

export interface IZipCodes {
  [key: string]: string
}

export type ZipCodeMap = { [key in Country]?: IZipCodes }

let zipcodeCache: ZipCodeMap = {}

export interface ICityLookup {
  zipcode: number | string
  locale: IsoLocale
  fileLocation?: string
  global?: any
}

export type CityConf = Pick<ICityLookup, 'locale' | 'fileLocation' | 'global'>

const defaultFileLocation = 'https://cdn.jsdelivr.net/gh/omnicar/sam-zip-city/dist/countries/'

export const getCountryFromLocale = (locale: IsoLocale) => locale.split('-')[1] as Country

export const initZipCityCountry = async (cityLookup: CityConf): Promise<IZipCodes | undefined> => {
  const { locale, fileLocation = defaultFileLocation, global } = cityLookup
  const country = getCountryFromLocale(locale)

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
  await loadScript(scriptPath, `zipCity-${country}`)
  // Check again if the variable is available
  zipcodeCountryMap = getZipcodeMapFromGlobal(myGlobal, country)
  if (zipcodeCountryMap) {
    return zipcodeCountryMap
  }
  return undefined
}

export const getCityFromZip = async (cityLookup: ICityLookup) => {
  const { zipcode } = cityLookup
  const countryMap = await initZipCityCountry(cityLookup)
  if (!countryMap) {
    return false
  }
  const zipKey = `${zipcode}`.replace(' ', '')
  const cityName = countryMap.hasOwnProperty(zipKey) ? countryMap[zipKey] : false
  return cityName
}

const getZipcodeMapFromGlobal = (global: any, country: Country) => {
  const zipcodeCountryMap = global[`zipcodeMap${country}`]
  if (zipcodeCountryMap) {
    zipcodeCache[country] = zipcodeCountryMap
    return zipcodeCountryMap
  }
}

const loadScript = (src: string, id: string) => {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(id)
    if (!existingScript) {
      if (document.head) {
        let s
        s = document.createElement('script')
        s.src = src
        s.id = id
        s.onload = resolve
        s.onerror = reject
        s.async = true
        document.head.appendChild(s)
      } else {
        reject()
      }
    } else {
      resolve(existingScript)
    }
  })
}
