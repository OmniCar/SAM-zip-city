# SAM zip-city
This library aims to do city lookups in a fast (client-side), generic way.

The script will dynamically load the appropriate file with zipcodes and city names for a given country.

This allows for smaller bundle size and means that the file(s) are only downloaded when needed.

_But all the zipcode files are inside the repo?_

The zip-code are fetched from admin.omnicar.io/data/zip-codes/

## How to install
`npm install @omnicar/sam-zip-city` or `yarn add @omnicar/sam-zip-city`

## How to use
```
import { getCityFromZip } from '@omnicar/sam-zip-city'

const myFunc = async () => {
  const city = await getCityFromZip({
    zipcode: 2300,
    country: 'DK' 
  })
  console.log(city)
}
```

Or to initialise a country before requesting a city:
```
import { initZipCityCountry } from '@omnicar/sam-zip-city'

const myOtherFunc = async () => {
  await initZipCityCountry({ country: 'DK' })
  console.log('Danish zipcodes and cities should be ready!')
}
```
